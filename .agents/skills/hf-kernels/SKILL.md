# Hugging Face Kernels — Hub-Distributed Compute Kernels Skill

> Source: https://huggingface.co/docs/kernels/v0.16.0/index
> Package: `pip install kernels==0.16.0`
> Builder: `pip install kernel-builder`
> Version: **v0.16.0** (stable)

## When to Load

- Optimizing CTAX agent model inference on GPU hardware
- Building custom compute kernels for DGM gate / token processing
- Distributing kernels across DeckerGUI ecosystem (multi-GPU/multi-device)
- Replacing PyTorch layer forward methods with optimized Hub kernels
- Creating portable kernel builds for CUDA, ROCm, Metal, XPU, CPU
- Speeding up QLoRA fine-tuning with fused attention/activation kernels

---

## Core Concept

**Kernels are a first-class Hub repository type** — pre-compiled compute kernels that can be loaded directly from Hugging Face Hub into any Python process. They solve "dependency hell" by providing versioned, portable, device-specific kernel builds.

### Why Kernels Matter for DeckerGUI

| Problem | Kernel Solution |
|---------|-----------------|
| CTAX inference slow on GPU | Load optimized attention/activation kernels from Hub |
| DGM gate token processing bottleneck | Custom fused kernel for gate computation |
| Multi-device deployment (L440 CPU + GPU server) | Same code, different kernel builds auto-selected |
| QLoRA training speed | Fused training kernels from `kernels-community` |
| Kernel version conflicts across projects | Hub versioning with `get_kernel(version=N)` |

---

## Basic Usage

### Loading Kernels

```python
from kernels import get_kernel

# Load optimized activation kernels from Hub
activation = get_kernel("kernels-community/activation", version=1)

import torch
x = torch.randn((10, 10), dtype=torch.float16, device="cuda")
y = torch.empty_like(x)
activation.gelu_fast(y, x)
```

### Checking Availability

```python
from kernels import has_kernel, get_kernel_variants

# Check if kernel works on current hardware
available = has_kernel("kernels-community/activation", version=1)

# See why a kernel was rejected
for decision in get_kernel_variants("kernels-community/activation", version=1):
    name = decision.variant.variant_str
    if isinstance(decision, VariantAccepted):
        print(f"{name}: compatible")
    else:
        print(f"{name}: rejected ({decision.reason})")
```

### Inspecting Loaded Kernels

```python
from kernels import get_loaded_kernels

for loaded in get_loaded_kernels():
    print(loaded.metadata.name, loaded.metadata.version, loaded.repo_info)
    # loaded.metadata: id, name, version, license, upstream, source, python_depends, backend
    # loaded.module: the imported kernel module
    # loaded.repo_info: RepoInfo(repo_id, revision) or None
```

### Loading Locked Kernels (Reproducible)

```python
from kernels import load_kernel, get_locked_kernel

# Load from lockfile (reproducible builds)
kernel = load_kernel("kernels-community/activation", lockfile="kernels.lock")

# Load using package metadata lockfile
kernel = get_locked_kernel("kernels-community/activation")
```

### Trust Remote Code

```python
from kernels import get_kernel

# Only load from trusted orgs (default)
kernel = get_kernel("kernels-community/activation", version=1)

# Allow untrusted orgs (use with caution)
kernel = get_kernel("my-org/my-kernel", version=1, trust_remote_code=True)
```

---

## Kernelizing Models

**Replace layer forward methods with Hub-optimized kernels:**

```python
from kernels import kernelize, Mode

model = MyModel(...)
model = kernelize(model, mode=Mode.INFERENCE)

# For training
model = kernelize(model, mode=Mode.TRAINING)

# With torch.compile
model = kernelize(model, mode=Mode.INFERENCE | Mode.TORCH_COMPILE)
```

### Making Layers Extensible

```python
from kernels import use_kernel_forward_from_hub

@use_kernel_forward_from_hub("SiluAndMul")
class SiluAndMul(nn.Module):
    def forward(self, input: torch.Tensor) -> torch.Tensor:
        d = input.shape[-1] // 2
        return F.silu(input[..., :d]) * input[..., d:]
```

### Registering Custom Mappings

```python
from kernels import register_kernel_mapping, LayerRepository

kernel_layer_mapping = {
    "SiluAndMul": {
        "cuda": LayerRepository(
            repo_id="kernels-community/activation",
            layer_name="SiluAndMul",
            version=1,
        ),
        "rocm": LayerRepository(
            repo_id="kernels-community/activation",
            layer_name="SiluAndMul",
            version=1,
        )
    }
}
register_kernel_mapping(kernel_layer_mapping)
```

### Device-Specific Kernels (CUDA Capabilities)

```python
from kernels import Device, CUDAProperties

kernel_layer_mapping = {
    "SiluAndMul": {
        Device(type="cuda", properties=CUDAProperties(min_capability=75, max_capability=89)): LayerRepository(
            repo_id="kernels-community/activation",
            layer_name="SiluAndMul",
            version=1,
        ),
        Device(type="cuda", properties=CUDAProperties(min_capability=90, max_capability=sys.maxsize)): LayerRepository(
            repo_id="kernels-community/activation-hopper",
            layer_name="SiluAndMul",
            version=1,
        ),
    }
}
```

---

## Building Custom Kernels

### Initialize a Kernel Project

```bash
kernel-builder init --name ctaxnagomi/dgui-kernels --backends all
```

### Project Structure

```
dgui-kernels/
├── build.toml          # Build configuration
├── src/
│   ├── cuda/
│   │   └── activation/
│   │       ├── kernel.cu
│   │       └── CMakeLists.txt
│   ├── cpu/
│   │   └── activation/
│   │       ├── kernel.cpp
│   │       └── CMakeLists.txt
│   └── rocm/
│       └── activation/
│           ├── kernel.hip
│           └── CMakeLists.txt
└── tests/
    └── test_activation.py
```

### Build and Upload

```bash
# Build locally
kernel-builder build

# Build and upload to Hub
kernel-builder build-and-upload --repo-id ctaxnagomi/dgui-kernels

# Check ABI compatibility
kernel-builder check-abi

# List supported variants
kernel-builder list-variants
```

### Kernel Builder Commands

| Command | Purpose |
|---------|---------|
| `kernel-builder init` | Scaffold new kernel project |
| `kernel-builder build` | Build locally |
| `kernel-builder build-and-upload` | Build + upload to Hub |
| `kernel-builder upload` | Upload pre-built artifacts |
| `kernel-builder check-config` | Validate build.toml |
| `kernel-builder check-abi` | Check ABI compatibility |
| `kernel-builder list-variants` | Show supported backends |
| `kernel-builder devshell` | Development shell |
| `kernel-builder skills add` | Install AI assistant skills |

---

## DeckerGUI Integration Map

### CTAX Agent Inference Optimization

```python
# Before: standard PyTorch inference
output = model(input)

# After: kernelized inference with Hub kernels
from kernels import kernelize, Mode
model = kernelize(model, mode=Mode.INFERENCE)
output = model(input)  # Auto-uses optimized kernels
```

### DGM Gate Token Processing

```python
# Custom kernel for DGM gate computation
@use_kernel_forward_from_hub("DGMBatchGate")
class DGMBatchGate(nn.Module):
    def forward(self, tokens: torch.Tensor, decisions: torch.Tensor) -> torch.Tensor:
        # Fused gate computation
        mask = decisions.unsqueeze(-1).expand_as(tokens)
        return torch.where(mask, tokens, torch.zeros_like(tokens))

# Kernelize for inference
model = kernelize(model, mode=Mode.INFERENCE)
```

### KPI Tokenizer Acceleration

```python
# Fused token counting kernel
@use_kernel_forward_from_hub("FusedTokenCount")
class FusedTokenCount(nn.Module):
    def forward(self, text_batch: list[str]) -> torch.Tensor:
        # Optimized batch tokenization
        pass
```

### Multi-Device Deployment

```python
# Same code works on L440 CPU and GPU server
from kernels import has_kernel

if has_kernel("kernels-community/activation", version=1):
    model = kernelize(model, mode=Mode.INFERENCE)
else:
    print("No GPU kernels available, using CPU fallback")
```

---

## Available Hub Kernels

| Kernel | Purpose | Backends |
|--------|---------|----------|
| `kernels-community/activation` | GELU, SiLU, etc. | CUDA, ROCm |
| `kernels-community/attention` | Flash attention | CUDA |
| `kernels-community/layernorm` | Fused layer norm | CUDA, ROCm |
| `kernels-community/rmsnorm` | RMS normalization | CUDA |
| `kernels-community/rotary` | RoPE embeddings | CUDA |
| `kernels-community/silu-and-mul` | SwiGLU activation | CUDA |

---

## Relevance to L440

| Scenario | Kernel Benefit |
|----------|----------------|
| L440 CPU-only inference | CPU kernel builds auto-selected |
| GPU server inference | CUDA kernels auto-selected |
| Same codebase | `has_kernel()` detects hardware |
| QLoRA in Colab | Training kernels from Hub |

---

## Implementation Checklist

### Phase 1: Assessment
- [ ] Check which Hub kernels are available for DeckerGUI layers
- [ ] Benchmark current inference latency on L440 and GPU server
- [ ] Identify bottleneck layers (attention, activation, normalization)

### Phase 2: Integration
- [ ] Install `kernels` package in DeckerGUI
- [ ] Add `@use_kernel_forward_from_hub()` decorators to CTAX layers
- [ ] Kernelize CTAX model with `kernelize(model, mode=Mode.INFERENCE)`
- [ ] Test fallback behavior on L440 (no GPU kernels)

### Phase 3: Custom Kernels
- [ ] Create `dgui-kernels` project with `kernel-builder init`
- [ ] Implement DGM gate fused kernel
- [ ] Implement KPI tokenizer batch kernel
- [ ] Build and upload to Hub as `ctaxnagomi/dgui-kernels`

### Phase 4: Distribution
- [ ] Add kernel-builder skills to `.agents/skills/`
- [ ] Document kernel usage in CTAX runtime
- [ ] Add kernel availability check to DGUI status command

---

## References

1. Hugging Face Kernels v0.16.0 Documentation (huggingface.co/docs/kernels/v0.16.0)
2. Kernel Hub (huggingface.co/kernels)
3. kernel-builder CLI (huggingface.co/docs/kernels/v0.16.0/builder-cli)
4. Kernel Layers API (huggingface.co/docs/kernels/v0.16.0/layers)
5. Kernels API Reference (huggingface.co/docs/kernels/v0.16.0/api/kernels)
6. DeckerGUI CTAX Runtime (dgui-cli-go/internal/ctax/)
7. DeckerGUI Three-Layer Architecture (dgui-cli-go/ARCHITECTURE.md)
