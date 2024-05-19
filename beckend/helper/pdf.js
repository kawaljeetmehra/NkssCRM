const puppeteer = require('puppeteer');
const AttendanceController = require("../controller/AttendanceController");


function spellNumber(num) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand'];

    function convertLessThanOneThousand(number) {
        let words = '';

        if (number % 100 < 10) {
            words += units[number % 100];
        } else if (number % 100 < 20) {
            words += teens[number % 10];
        } else {
            words += tens[Math.floor(number / 10) % 10] + ' ' + units[number % 10];
        }

        if (number >= 100) {
            words = units[Math.floor(number / 100)] + ' Hundred ' + words;
        }

        return words.trim();
    }

    if (num === 0) {
        return 'zero';
    }

    let words = '';
    let i = 0;

    do {
        const n = num % 1000;
        if (n !== 0) {
            const str = convertLessThanOneThousand(n);
            words = str + ' ' + scales[i] + ' ' + words;
        }
        num = Math.floor(num / 1000);
        i++;
    } while (num > 0);

    return words.trim();
}


async function generatePDF(req) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let user_id = req.query.user_id;
        let month = req.query.month;
        let year = req.query.year;

        let form = {
            user_id,
            month,
            year
        }
        let data = await new Promise((resolve, reject) => {
            AttendanceController.userSalarySlip(form, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
       
        // Example HTML content
        let htmlContent=` <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FPDF Preview</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            </head>`;
        
        data.map(data => {
            htmlContent+=`
                    <body style="margin: 0;">
                        <div style="border:17px solid #D2A5FA; height:90%;font-family:Calibri">
                                
                            <h1 style="color:#D2A5FA;" align="center">Nkss Digital Services Pvt. Ltd.</h1>
                            <h4 style="margin-top:-2%" align="center">Gali No 5 Stadium Road R.K. Puram Part II Karnal Haryana 132001</h4>
                
                            <div style="border:2px solid #D2A5FA; height:90%;margin-left:10px; margin-right:10px;margin-bottom:10px; margin-top:-5px"></div>
                            
                            <h4 align="center">Salary Slip</h4>
                
                            <div style="border:80px solid #CEB5DD; height:90%;margin-left:100px; margin-right:100px;"></div>
                
                            
                            <table style="margin-top:-150px;margin-left:130px">
                                <tr>
                                    <td><b>Name: </b></td>
                                    <td>${data.name}</td>
                                </tr>
                                <tr>
                                    <td><b>Designation: </b></td>
                                    <td>${data.designation}</td>
                                </tr>
                                <tr>
                                    <td><b>Employee ID: </b></td>
                                    <td> ${data.user_id} </td>
                                </tr>
                                <tr>
                                    <td><b>Bank Name: </b></td>
                                    <td>${data.bank_name}</td>
                                </tr>
                                <tr>
                                    <td><b>Bank Account Number: </b></td>
                                    <td>${data.bank_account_number}</td>
                                </tr>
                                <tr>
                                    <td><b>IFSC Code: </b></td>
                                    <td>${data.ifsc}</td>
                                </tr>
                            </table>
                
                            <h4 align="center" style="margin-top:40px;">Calculation Details</h4>
                                
                            <div style="border:16px solid #AD84C6; height:90%;margin-left:100px; margin-right:100px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Earning</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Deductions</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #E4D9EA; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Basic</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;"> &nbsp; &nbsp; ${data.monthlySalary}</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Leave Deductions</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp; &nbsp; ${data.deductedSalary}</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #F1EDF5; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Bonus</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Salary Advance</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #E4D9EA; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Over Time</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Provident Fund</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                
                            <div style="border:16px solid #F1EDF5; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Carried Over</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Other Deductions</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #E4D9EA; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Commission</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #F1EDF5; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Pay Adjusted</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #E4D9EA; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #F1EDF5; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Total Addition</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;"> &nbsp; &nbsp; ${data.monthlySalary}</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; Total Deduction</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;"> &nbsp; &nbsp; ${data.deductedSalary}</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #E4D9EA; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:30%;">&nbsp;</td>
                                </tr>
                            </table>
                
                            <div style="border:16px solid #F1EDF5; height:90%;margin-left:100px; margin-right:100px;margin-top:-5px;"></div>
                
                            <table style="margin-left:100px; margin-right:100px;margin-top:-28px;margin-bottom:10px;">
                                <tr>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; &nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:20%;">&nbsp;</td>
                                    <td style="color:black;border-left:2px solid white;width:1%;">&nbsp;</td>
                                    <td style="color:black;width:30%;"> &nbsp; &nbsp; <b>Net Salary</b></td>
                                    <td style="color:black;border-left:2px solid white;width:30%;"> &nbsp; &nbsp; Rs. ${data.calculatedSalary}</td>
                                </tr>
                            </table>
                
                            <p style="margin-left:100px"><b>Total Amount in Words:</b> ${spellNumber(data.calculatedSalary)} Rupees Only</p>
                
                            <div style="margin-top:82px">
                                <img style="margin-left:70px" src="http://localhost:4000/uploads/stamp.png" width="100px" heigth="100px" />
                            </div>
                            <div style="margin-top:-80px; margin-left:30px">
                                <img style="margin-left:70px" src="http://localhost:4000/uploads/sign.png" width="100px" heigth="100px" />
                            </div>
                            <p style="margin-left:50px; font-size:25px;margin-top:-10px">Naman Sharma</p>
                            <p style="color:#DCB6FB; margin-left:50px; margin-top:-20px">Founder & CEO, NKSS Digital Services</p>
                            
                            <div style="border:2px solid #D2A5FA; height:90%;margin-left:10px; margin-right:10px;margin-bottom:10px; margin-top:-5px"></div>
                
                            <table style="margin-left:30px; margin-right:100px">
                                <tr>
                                    <td style="width:90%;">798-833-71565, 740-450-8698</td>
                                    <td style="text-align:right;">Contact@nkssdigitalservices.com</td>
                                </tr>
                            </table>
                        </div>
                    </body>
            `;
        })

        htmlContent+='</html>';

        // Generate PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close(); // Ensure browser is closed regardless of success or failure

        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error; // Rethrow the error for proper handling
    }
}

module.exports = generatePDF;
