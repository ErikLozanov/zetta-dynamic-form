const ZIP_DATABASE: Record<string, { city: string; state: string }> = {
  "90210": { city: "Beverly Hills", state: "CA" },
  "10001": { city: "New York", state: "NY" },
  "94043": { city: "Mountain View", state: "CA" }
};

interface ApiResponse {
  success: boolean;
  data?: { city: string; state: string };
  message?: string;
}

export const fetchLocationByZip = (zipCode: string): Promise<ApiResponse> => {
  console.log(`Fetching mock data for zip: ${zipCode}...`);
  return new Promise((resolve) => {
    setTimeout(() => { 
      const data = ZIP_DATABASE[zipCode];
      resolve(data ? { success: true, data } : { success: false, message: "Invalid Zip" });
    }, 1500);
  });
};