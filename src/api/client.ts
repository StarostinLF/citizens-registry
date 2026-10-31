export const apiClient = async (path: string, options: RequestInit = {}) => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
	const response = await fetch(`${baseUrl}${path}`, options);

	if (!response.ok) throw new Error(`API Error: ${response.status}`);

	return response.json();
};
