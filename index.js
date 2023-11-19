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

    let links = await page1.evaluate(()=>Array.from(document.querySelectorAll('.tender-table > table > tbody > tr > td:nth-child(2) > span > div > div > a'),(e)=>({text:e.innerText , link:e.href})));
    console.log('num of links in page 1 :',links.length);
    // console.log(links);//links in page 1

    for (let i = 0 ; i< numOfPagesCal.length ; i++){

        const page2 = await browser.newPage();
        await page2.goto(numOfPagesCal[i]);
        await page2.waitForSelector('body');
        const newLinks = await page2.evaluate(()=>Array.from(document.querySelectorAll('.tender-table > table > tbody > tr > td:nth-child(2) > span > div > div > a'), (e)=>({text:e.innerText , link: e.href})));
        const oldlen = links.length;
        links = links.concat(newLinks);
        page2.close();
        console.log(`num of links in page ${i+2} : ${links.length - oldlen}`);
    }
    console.log('total links :', links.length);
    // console.log("All links : " , links);// all links of all pages
    



    //intializing an array to push scraped data

    let scrapedData = [];


    //navigating each tender link and scraping data

    for(let i = 0; i<links.length;i++){
        const page3 = await browser.newPage();
        await page3.goto(links[i].link);

        //extracting title

        //extracting agency

        //extracting atmId


        //extracting category

        //extracting location

        //extracting region 

        //extracting idNumber

        //extracting publishedDate

        //extracting closingData

        //extracting description

        //extracting link
        
        // const link = link[i].link;

        //extracting updatedDateTime


        //pushing the scraped data into the array
        // scrapedData.push({
        //     title,
        //     agency,
        //     atmId,
        //     category,
        //     location,
        //     region,
        //     idNumber,
        //     publishedDate,
        //     closingDate,
        //     description,
        //     link,
        //     updatedDateTime,
        //   });


        console.log(`scraped tender ${i+1}`);
        page3.close();

    }


    browser.close();
}

run();