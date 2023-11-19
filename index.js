const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async function run(){

    const browser = await puppeteer.launch({headless:false});

    let page = await browser.newPage();

    await page.goto('https://www.tenders.act.gov.au/tender/search?preset=open&page');

    //navigating to open tenders in the dropdown menu of Tenders

    // await page.waitForTimeout(2000);

    await page.hover('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2)');
    await page.waitForTimeout(3000);    
    // await page.waitForSelector('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul');
    
    await page.click('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul > li:nth-child(2)');
    await page.waitForTimeout(3000);
    const url = page.url();
    const page1 = await browser.newPage();
    page.close();
    await page1.goto(url);

    await page1.screenshot({path:'act.png' , fullpage:true});

    

    //finding num of pages of 'current tenders'

    //  await page1.waitForSelector('#paging');
     const numOfPagesCal = await page1.evaluate(()=>Array.from(document.querySelectorAll('.paging > a'),(e)=>e.href));
     const numOfPages = numOfPagesCal.length;
     console.log('links of pages to traverse : ', numOfPagesCal);
     console.log('num of pages except page 1 : ', numOfPages);


    //traversing each page of 'current tenders' and collecting all tender links

    let links = await page1.evaluate(() => {
        const rows = document.querySelectorAll('.tender-table > table > tbody > tr');
      
        return Array.from(rows, (row) => {
          const textElement = row.querySelector('td:nth-child(2) > span > div > div > a');
          const dateElement = row.querySelector('td:nth-child(3) > span');
          
          const text = textElement ? textElement.innerText : '';
          const link = textElement ? textElement.href : '';
          
          const PublishedDateElement = dateElement ? dateElement.querySelector('.opening_date') : null;
          const ClosingDateElement = dateElement ? dateElement.querySelector('.closing_date') : null;
          
          const PublishedDate = PublishedDateElement ? PublishedDateElement.innerText : '';
          const ClosingDate = ClosingDateElement ? ClosingDateElement.innerText : '';
      
          return { text, link, PublishedDate, ClosingDate };
        });
      });
    
    console.log('num of links in page 1 :',links.length);
    // console.log(links);//links in page 1

    for (let i = 0 ; i< numOfPagesCal.length ; i++){

        const page2 = await browser.newPage();
        await page2.goto(numOfPagesCal[i]);
        await page2.waitForSelector('body');
        const newLinks = await page2.evaluate(() => {
            const rows = document.querySelectorAll('.tender-table > table > tbody > tr');
          
            return Array.from(rows, (row) => {
              const textElement = row.querySelector('td:nth-child(2) > span > div > div > a');
              const dateElement = row.querySelector('td:nth-child(3) > span');
              
              const text = textElement ? textElement.innerText : '';
              const link = textElement ? textElement.href : '';
              
              const PublishedDateElement = dateElement ? dateElement.querySelector('.opening_date') : null;
              const ClosingDateElement = dateElement ? dateElement.querySelector('.closing_date') : null;
              
              const PublishedDate = PublishedDateElement ? PublishedDateElement.innerText : '';
              const ClosingDate = ClosingDateElement ? ClosingDateElement.innerText : '';
          
              return { text, link, PublishedDate, ClosingDate };
            });
          });
        const oldlen = links.length;
        links = links.concat(newLinks);
        page2.close();
        console.log(`num of links in page ${i+2} : ${links.length - oldlen}`);
    }
    console.log('total links :', links.length);
    // console.log("All links : " , links);// all links of all pages

    // console.log(links);
    



    //intializing an array to push scraped data

    let scrapedData = [];
    
    let i = 1;

    //navigating each tender link and scraping data

    for(const each of links){
        const page3 = await browser.newPage();
        await page3.goto(each.link);

        //extracting title
        const title = await page3.evaluate(()=>{

            let titleElement = document.querySelector("#tenderTitle");
            titleElement ? titleElement = titleElement.innerText : titleElement = "";
            return titleElement;
         });

        //extracting agency
        const agency = await page3.evaluate(()=>{
            let agencyElment = document.querySelector('#opportunityHeader > div > div:nth-child(2)');
            agencyElment ? agencyElment = agencyElment.innerText.replace(/\n+/g," ") : agencyElment = "";
            return agencyElment;
         });

        //extracting atmId
        const atmId = "";

        //extracting category
        const category = await page3.evaluate(()=>{
            let categoryElement = document.querySelector('#tenderDescription > div:nth-child(2) > div:nth-child(2)');
            categoryElement ? categoryElement = categoryElement.innerText.replace(/\n+/g,"") : categoryElement = "";
            return categoryElement;
         });

        //extracting location
        const location = ["ACT"];

        //extracting region 
        const region = ["not specified"];

        //extracting idNumber
        const idNumber = await page3.evaluate(()=>{
            let idNumberElement = document.querySelector('#opportunityGeneral > div > div:nth-child(4) > div:nth-child(2)');
            idNumberElement ? idNumberElement = idNumberElement.innerText : idNumberElement = "";
            return idNumberElement;
         });

        //extracting publishedDate
        
        const formatDate = (datePart)=>{
            if (datePart) {
                const dateObj = new Date(datePart);
      
                // Get the day, month, and year
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
                const year = dateObj.getFullYear();
              
                // Combine the formatted parts
                const formattedDate = `${day} ${month} ${year}`;
    
            return formattedDate;
            } else {
            return "No date found"
            }
        }   

        const publishedDate = formatDate(each.PublishedDate);
        //extracting closingData
        const closingDate = formatDate(each.ClosingDate);


        //extracting description
        const description = await page3.evaluate(()=>{
            let descriptionElement = document.querySelector('#tenderDescription > div:nth-child(2) > div');
            descriptionElement ? descriptionElement = descriptionElement.innerText.replace(/\n+/g," ") : descriptionElement = " ";
            return descriptionElement;
         });
        //extracting link
        
        const link = each.link;

        //extracting updatedDateTime
        const updatedDateTime = "No date found";

        //pushing the scraped data into the array
        scrapedData.push({
            title,
            agency,
            atmId,
            category,
            location,
            region,
            idNumber,
            publishedDate,
            closingDate,
            description,
            link,
            updatedDateTime,
          });

        
        console.log(`scraped tender ${i}`);
        i++;
        page3.close();

    }


    console.log(scrapedData);
    browser.close();
}

run();