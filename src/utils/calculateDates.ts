// calculate dates for Visual Crossing url endpoint

export const calculateDates = (localtime: string) => {

  const currentDate = new Date(localtime.split(" ")[0]); 

  // Calculate 3 days before and 3 days after
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 3);  // 3 days before

  const endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + 3);  // 3 days after

  // Return dates as YYYY-MM-DD format
  return {
      startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
      endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,
  };
};