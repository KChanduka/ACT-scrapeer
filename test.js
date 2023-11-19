const { default: test } = require('node:test');
const puppeteer = require ('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin());

async function testrun (){
     const browser = await puppeteer.launch({headless:false});
    let page = await browser.newPage();
    
    await page.goto('https://www.tenders.act.gov.au/tender/search?preset=open&page');

    // await page.waitForSelector('navbar navbar-inverse');
    await page.waitForTimeout(2000);

    await page.hover('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2)');
    await page.waitForTimeout(2000);    
    // await page.waitForSelector('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul');
    
    await page.click('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul > li:nth-child(2)');
    await page.waitForTimeout(2000);
    const url = page.url();
    const page1 = await browser.newPage();
    page.close();
    await page1.goto(url);


      //  await page1.waitForSelector('#paging');
      const numOfPagesCal = await page1.evaluate(()=>Array.from(document.querySelectorAll('.paging > a'),(e)=>e.href));
      const numOfPages = numOfPagesCal.length;
      console.log('links of pages to traverse : ', numOfPagesCal);
      console.log('num of pages except page 1 : ', numOfPages);
 
 
     //traversing each page of 'current tenders' and collecting all tender links
 
     const links = await page1.evaluate(() => {
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

     const page3 = await browser.newPage();
     await page3.goto(links[0].link);
    // await page3.goto('https://www.tenders.act.gov.au/tender/view?id=255305');

//wait for selector

    await page3.waitForSelector('#opportunityDisplayWrapper');

//extracting title
     const title = await page3.evaluate(()=>{

        let titleElement = document.querySelector("#tenderTitle");
        titleElement ? titleElement = titleElement.innerText : titleElement = "";
        return titleElement;
     });

     console.log('title : ', title);

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

     console.log('category : ' , category);
//extracting location
     const location = ["ACT"]
//extracting region

     const region = ["not specified"]
//extracting  idNumber
     
     const idNumber = await page3.evaluate(()=>{
        let idNumberElement = document.querySelector('#opportunityGeneral > div > div:nth-child(4) > div:nth-child(2)');
        idNumberElement ? idNumberElement = idNumberElement.innerText : idNumberElement = "";
        return idNumberElement;
     });

//extracting publishedDate
 let publishedDate;
    const OpDatePart = links[0].PublishedDate.match(/\d{1,2} [A-Za-z]+ \d{4}/);
        
    if (OpDatePart) {
    const parts = OpDatePart[0].split(' ');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    const outputDateString = `${day} ${month} ${year}`;
     publishedDate = outputDateString;
    } else {
    publishedDate = "No date found"
    }

    console.log( 'publish date ' , publishedDate);

//extracting closingDate
let closingDate;
const ClDatePart = links[0].ClosingDate.match(/\d{1,2} [A-Za-z]+ \d{4}/);
    
if (ClDatePart) {
const parts = ClDatePart[0].split(' ');
const day = parts[0];
const month = parts[1];
const year = parts[2];

const outputDateString = `${day} ${month} ${year}`;
 closingDate = outputDateString;
} else {
closingDate = "No date found"
}

console.log( 'closing date ' , closingDate);

//extracting description

     const description = await page3.evaluate(()=>{
        let descriptionElement = document.querySelector('#tenderDescription > div:nth-child(2) > div');
        descriptionElement ? descriptionElement = descriptionElement.innerText.replace(/\n/g,"\n") : descriptionElement = " ";
        return descriptionElement;
     })
     console.log("description : ", description);

//extracting link

//extracting updatedDateTime
    const updatedDateTime = "No date found";


     console.log('agency:' , agency);
     console.log('went to link[0]');

    

    browser.close();
    
}

testrun();