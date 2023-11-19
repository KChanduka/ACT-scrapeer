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
    await page.waitForTimeout(5000);    
    // await page.waitForSelector('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul');
    
    await page.click('.navbar.navbar-inverse > div > #myNavbar > ul > li:nth-child(2) > ul > li:nth-child(2)');
    await page.waitForTimeout(7000);
    const url = page.url();
    const page1 = await browser.newPage();
    page.close();
    await page1.goto(url);

    browser.close();

}

testrun();