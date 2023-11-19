function formatCustomDate(inputDate) {
    const dateObj = new Date(inputDate);
  
    // Get the day, month, and year
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
    const year = dateObj.getFullYear();
  
    // Combine the formatted parts
    const formattedDate = `${day} ${month} ${year}`;
  
    return formattedDate;
  }
  
  // Example usage
  const inputDate = 'Thu, 09 November 2023 4:10 pm';
  const formattedDate = formatCustomDate(inputDate);
  
  console.log(formattedDate); // Output: "09 Nov 2023"
  