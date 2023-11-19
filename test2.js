const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin());




async function test2(){

    const browser = await puppeteer.launch();
    const page1 = await browser.newPage();

    await page1.goto('https://www.tenders.act.gov.au/tender/search?preset=open');

    const links = await page1.evaluate(() => {
        const rows = document.querySelectorAll('.tender-table > table > tbody > tr');
      
        return Array.from(rows, (row) => {
          const textElement = row.querySelector('td:nth-child(2) > span > div > div > a');
          const dateElement = row.querySelector('td:nth-child(3) > span');
          
          const text = textElement ? textElement.innerText : '';
          const link = textElement ? textElement.href : '';
          
          const publishedDateElement = dateElement ? dateElement.querySelector('.opening_date') : null;
          const closingDateElement = dateElement ? dateElement.querySelector('.closing_date') : null;
          
          const publishedDate = publishedDateElement ? publishedDateElement.innerText : '';
          const closingDate = closingDateElement ? closingDateElement.innerText : '';
      
          return { text, link, publishedDate, closingDate };
        });
      });
      
      console.log(links);

      browser.close();
      
      

}

test2();