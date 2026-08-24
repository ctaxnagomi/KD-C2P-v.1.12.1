import { FileData, MVPData } from "../types";

export const convertRepoToMVP = async (files: FileData[], nameHint?: string): Promise<MVPData> => {
  try {
    const response = await fetch('/api/convert-repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files, nameHint }),
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMsg = errorData.error;
        }
      } catch {
        // use fallback status message
      }
      throw new Error(errorMsg);
    }

    const data: MVPData = await response.json();
    return data;
  } catch (error: any) {
    console.error('convertRepoToMVP failed:', error);
    throw error;
  }
};
