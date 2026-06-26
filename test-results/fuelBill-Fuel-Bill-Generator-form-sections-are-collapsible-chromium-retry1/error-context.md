# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fuelBill.spec.js >> Fuel Bill Generator >> form sections are collapsible
- Location: tests/e2e/fuelBill.spec.js:57:3

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 1
Received:    44
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "OpsTools" [ref=e6] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e18]: OpsTools
      - navigation [ref=e19]:
        - button "Document Generator" [ref=e21]:
          - generic [ref=e22]: Document Generator
          - img [ref=e23]
        - button "ROI Calculator" [ref=e26]:
          - generic [ref=e27]: ROI Calculator
      - generic [ref=e28]:
        - generic [ref=e29]:
          - img [ref=e30]
          - generic [ref=e33]: Guest · 0 credits
        - link "Log in" [ref=e35] [cursor=pointer]:
          - /url: /login
        - link "Sign up" [ref=e36] [cursor=pointer]:
          - /url: /signup
  - generic [ref=e38]:
    - generic [ref=e40]:
      - navigation [ref=e41]:
        - link "Home" [ref=e42] [cursor=pointer]:
          - /url: /
        - text: ›
        - link "Documents" [ref=e43] [cursor=pointer]:
          - /url: /documents
        - text: ›Fuel Bill Generator
      - generic [ref=e44]:
        - generic [ref=e45]:
          - heading "Free Fuel Bill Generator" [level=1] [ref=e46]
          - paragraph [ref=e47]: Choose a template, fill details — receipt updates live.
        - button "Generate in Bulk" [ref=e49] [cursor=pointer]:
          - img [ref=e50]
          - text: Generate in Bulk
    - generic [ref=e53]:
      - generic [ref=e54]:
        - paragraph [ref=e55]: Choose Template
        - generic [ref=e56]:
          - button "Thermal Full Dot-matrix with all fields" [ref=e57]:
            - paragraph [ref=e58]: Thermal Full
            - paragraph [ref=e59]: Dot-matrix with all fields
          - button "Classic POS Monospace receipt style" [ref=e60]:
            - paragraph [ref=e61]: Classic POS
            - paragraph [ref=e62]: Monospace receipt style
          - button "IOCL Formal Logo + dashed separators" [ref=e63]:
            - paragraph [ref=e64]: IOCL Formal
            - paragraph [ref=e65]: Logo + dashed separators
          - button "Thermal Compact Minimal thermal print" [ref=e66]:
            - paragraph [ref=e67]: Thermal Compact
            - paragraph [ref=e68]: Minimal thermal print
      - generic [ref=e69]:
        - generic [ref=e71]:
          - generic [ref=e72]:
            - button "⛽ Station Details" [ref=e73] [cursor=pointer]:
              - generic [ref=e74]: ⛽ Station Details
              - img [ref=e75]
            - generic [ref=e80]:
              - generic [ref=e82]:
                - generic [ref=e83]: Station Name
                - textbox [ref=e84]: PK FUEL STATION
              - generic [ref=e86]:
                - generic [ref=e87]: Station Address
                - textbox [ref=e88]: PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067
              - generic [ref=e89]:
                - generic [ref=e90]: Phone Number
                - textbox [ref=e91]: "38055913"
              - generic [ref=e92]:
                - generic [ref=e93]: VAT No.
                - textbox [ref=e94]: 7761395712V
              - generic [ref=e95]:
                - generic [ref=e96]: LST No.
                - textbox [ref=e97]
              - generic [ref=e98]:
                - generic [ref=e99]:
                  - generic [ref=e100]: Logo Image URL (optional)
                  - textbox "https://example.com/logo.png" [ref=e101]: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Indian_Oil_Logo.svg/500px-Indian_Oil_Logo.svg.png
                - generic [ref=e102]:
                  - img "logo preview" [ref=e103]
                  - generic [ref=e104]: Logo preview
          - generic [ref=e105]:
            - button "🧾 Bill Details" [active] [ref=e106] [cursor=pointer]:
              - generic [ref=e107]: 🧾 Bill Details
              - img [ref=e108]
            - generic [ref=e111]:
              - generic [ref=e112]:
                - generic [ref=e113]: Receipt / Bill No.
                - textbox [ref=e114]: G64695
              - generic [ref=e115]:
                - generic [ref=e116]: Invoice No.
                - textbox "e.g. 224105525C306687" [ref=e117]: "927267"
              - generic [ref=e118]:
                - generic [ref=e119]: Date
                - textbox [ref=e120]: 2026-06-26
              - generic [ref=e121]:
                - generic [ref=e122]: Time
                - textbox [ref=e123]: 15:54
              - generic [ref=e124]:
                - generic [ref=e125]: Nozzle No.
                - textbox "e.g. 4" [ref=e126]: N-02
              - generic [ref=e127]:
                - generic [ref=e128]: FCC ID
                - textbox "e.g. 000000001697748" [ref=e129]
              - generic [ref=e130]:
                - generic [ref=e131]: FIP No.
                - textbox "e.g. 01" [ref=e132]: "07"
              - generic [ref=e133]:
                - generic [ref=e134]: Local ID
                - textbox [ref=e135]: "00024735"
          - generic [ref=e136]:
            - button "🛢️ Fuel Details" [ref=e137] [cursor=pointer]:
              - generic [ref=e138]: 🛢️ Fuel Details
              - img [ref=e139]
            - generic [ref=e144]:
              - generic [ref=e145]:
                - generic [ref=e146]: Product / Fuel Type
                - combobox [ref=e147]:
                  - option "Petrol" [selected]
                  - option "Diesel"
                  - option "Xtra Premium"
                  - option "CNG"
                  - option "EV Charge"
              - generic [ref=e148]:
                - generic [ref=e149]: Rate / Litre (₹)
                - spinbutton [ref=e150]: "104.29"
              - generic [ref=e151]:
                - generic [ref=e152]: Volume / Qty (Litres)
                - spinbutton [ref=e153]
              - generic [ref=e154]:
                - generic [ref=e155]: Density (Kg/Cu.mtr)
                - textbox "771.9" [ref=e156]: "625.078"
              - generic [ref=e157]:
                - generic [ref=e158]: Preset Type
                - combobox [ref=e159]:
                  - option "Amount" [selected]
                  - option "Volume"
                  - option "Full Tank"
              - generic [ref=e160]:
                - generic [ref=e161]: Atot (cumulative amt)
                - textbox "e.g. 00121730171.27" [ref=e162]
              - generic [ref=e163]:
                - generic [ref=e164]: Vtot (cumulative vol)
                - textbox "e.g. 0001155464.120" [ref=e165]
              - generic [ref=e166]:
                - generic [ref=e167]: Payment Mode
                - combobox [ref=e168]:
                  - option "Cash" [selected]
                  - option "Card"
                  - option "UPI"
                  - option "Fleet Card"
          - generic [ref=e169]:
            - button "🚗 Customer Details" [ref=e170] [cursor=pointer]:
              - generic [ref=e171]: 🚗 Customer Details
              - img [ref=e172]
            - generic [ref=e175]:
              - generic [ref=e176]:
                - generic [ref=e177]: Customer Name
                - textbox "e.g. Puneet Sharma" [ref=e178]
              - generic [ref=e179]:
                - generic [ref=e180]: Vehicle Number
                - textbox "MH01AB1234" [ref=e181]
              - generic [ref=e182]:
                - generic [ref=e183]: Vehicle Type
                - combobox [ref=e184]:
                  - option "4W" [selected]
                  - option "2W"
                  - option "HMV"
                  - option "Auto"
                  - option "Bus"
              - generic [ref=e185]:
                - generic [ref=e186]: Mobile No.
                - textbox "Not Entered" [ref=e187]
              - generic [ref=e188]:
                - generic [ref=e189]: Attendant ID
                - textbox "Not Available" [ref=e190]
        - generic [ref=e191]:
          - generic [ref=e192]:
            - paragraph [ref=e193]: Live Preview
            - button "Save PDF" [ref=e194] [cursor=pointer]:
              - img [ref=e195]
              - text: Save PDF
          - generic [ref=e200]:
            - generic [ref=e201]:
              - img "logo" [ref=e202]
              - generic [ref=e203]: PK FUEL STATION
              - generic [ref=e204]: Welcomes You
              - generic [ref=e205]: PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067
              - generic [ref=e206]: "Tel. No.: 38055913"
            - generic [ref=e208]:
              - generic [ref=e209]: Inv.No
              - generic [ref=e210]: ": 927267"
            - generic [ref=e211]:
              - generic [ref=e212]: FIP No.
              - generic [ref=e213]: ": 07"
            - generic [ref=e214]:
              - generic [ref=e215]: Nozzle No.
              - generic [ref=e216]: ": N-02"
            - generic [ref=e217]:
              - generic [ref=e218]: Product
              - generic [ref=e219]: ": Petrol"
            - generic [ref=e220]:
              - generic [ref=e221]: Density
              - generic [ref=e222]: ": 625.078Kg/Cu.mtr"
            - generic [ref=e223]:
              - generic [ref=e224]: Preset Type
              - generic [ref=e225]: ": Amount"
            - generic [ref=e227]:
              - generic [ref=e228]: Rate(Rs/L)
              - generic [ref=e229]: ": 104.29"
            - generic [ref=e230]:
              - generic [ref=e231]: Volume(L)
              - generic [ref=e232]: ": 000000.00"
            - generic [ref=e233]:
              - generic [ref=e234]: Amount(Rs)
              - generic [ref=e235]: ": 000000.00"
            - generic [ref=e237]:
              - generic [ref=e238]: Vehicle No
              - generic [ref=e239]: ":"
            - generic [ref=e240]:
              - generic [ref=e241]: Mobile No
              - generic [ref=e242]: ": Not Entered"
            - generic [ref=e244]:
              - generic [ref=e245]: Date
              - generic [ref=e246]: ": 26/06/26"
            - generic [ref=e247]:
              - generic [ref=e248]: Time
              - generic [ref=e249]: ": 15:54"
            - generic [ref=e251]:
              - generic [ref=e252]: Mode
              - generic [ref=e253]: ": Cash"
            - generic [ref=e254]:
              - generic [ref=e255]: VAT No.
              - generic [ref=e256]: ": 7761395712V"
            - generic [ref=e258]:
              - text: Thank You! Please Visit
              - text: Again..
            - generic [ref=e260]:
              - text: "Printed on:"
              - text: 26/06/26 15:54
    - article [ref=e263]:
      - generic [ref=e264]:
        - generic [ref=e265]:
          - paragraph [ref=e266]: Need a fuel bill for office reimbursement? Generating one used to mean hunting for Word templates, wrestling with formatting, or waiting for your accounts team. OpsTools Fuel Bill Generator changes that. Fill in your details, pick a template, and have a print-ready petrol or diesel receipt in under a minute — no login, no subscription, no hassle.
          - paragraph [ref=e267]: "The generator supports four formats based on actual Indian petrol station receipts: the formal IOCL layout used by Indian Oil outlets, the Classic POS format common at private stations, and two thermal dot-matrix formats (full and compact) used at smaller pumps across the country."
          - paragraph [ref=e268]: Every field that appears on a real petrol pump receipt is available. The preview updates live as you type. When you are ready, click Save PDF to download your receipt directly. Your data never leaves your device.
        - generic [ref=e269]:
          - generic [ref=e270]:
            - generic [ref=e271]: 🔒
            - generic [ref=e272]: 100% Private
            - generic [ref=e273]: Data never leaves your browser
          - generic [ref=e274]:
            - generic [ref=e275]: ⚡
            - generic [ref=e276]: Instant PDF
            - generic [ref=e277]: Print or save in one click
          - generic [ref=e278]:
            - generic [ref=e279]: 🇮🇳
            - generic [ref=e280]: India-specific
            - generic [ref=e281]: GST & compliance formats
          - generic [ref=e282]:
            - generic [ref=e283]: ✅
            - generic [ref=e284]: Free forever
            - generic [ref=e285]: No login, no payment
      - generic [ref=e287]:
        - heading "What is a Fuel Bill?" [level=2] [ref=e288]
        - paragraph [ref=e289]: A fuel bill is the receipt issued by a petrol station when you purchase fuel. It serves as proof of purchase and is commonly used in India for employee travel reimbursement claims, business expense records, and tax documentation.
      - generic [ref=e291]:
        - heading "Why Use a Fuel Bill Generator?" [level=2] [ref=e292]
        - generic [ref=e293]:
          - generic [ref=e294]:
            - generic [ref=e295]: "1"
            - generic [ref=e296]:
              - generic [ref=e297]: Reimbursement claims
              - generic [ref=e298]: Most Indian employers require a fuel receipt for travel or conveyance reimbursement.
          - generic [ref=e299]:
            - generic [ref=e300]: "2"
            - generic [ref=e301]:
              - generic [ref=e302]: Petrol station operators
              - generic [ref=e303]: Run a small pump without a POS system? Generate receipts manually using the thermal formats.
          - generic [ref=e304]:
            - generic [ref=e305]: "3"
            - generic [ref=e306]:
              - generic [ref=e307]: Vehicle fleet management
              - generic [ref=e308]: Track fuel spend across multiple vehicles with consistent, structured receipts.
          - generic [ref=e309]:
            - generic [ref=e310]: "4"
            - generic [ref=e311]:
              - generic [ref=e312]: Business expense records
              - generic [ref=e313]: Self-employed professionals can maintain clean fuel expense records.
          - generic [ref=e314]:
            - generic [ref=e315]: "5"
            - generic [ref=e316]:
              - generic [ref=e317]: Quick replacement for lost receipts
              - generic [ref=e318]: Misplaced your petrol pump receipt? Generate a replacement before your reimbursement deadline.
      - generic [ref=e320]:
        - heading "Features" [level=2] [ref=e321]
        - generic [ref=e322]:
          - generic [ref=e323]:
            - generic [ref=e324]: 🧾
            - generic [ref=e325]: 4 Indian receipt templates
            - generic [ref=e326]: IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian pump receipts.
          - generic [ref=e327]:
            - generic [ref=e328]: 👁️
            - generic [ref=e329]: Live preview
            - generic [ref=e330]: See your bill update in real time as you fill the form.
          - generic [ref=e331]:
            - generic [ref=e332]: ⬇️
            - generic [ref=e333]: Direct PDF download
            - generic [ref=e334]: One click downloads the receipt as a PDF — no print dialog needed.
          - generic [ref=e335]:
            - generic [ref=e336]: 🏷️
            - generic [ref=e337]: Custom logo
            - generic [ref=e338]: Paste any image URL to add your station's logo to the bill.
          - generic [ref=e339]:
            - generic [ref=e340]: 📱
            - generic [ref=e341]: Mobile-friendly
            - generic [ref=e342]: Works on iPhone, Android, and any tablet.
          - generic [ref=e343]:
            - generic [ref=e344]: 🔒
            - generic [ref=e345]: 100% private
            - generic [ref=e346]: No data is stored or transmitted. Everything happens in your browser.
          - generic [ref=e347]:
            - generic [ref=e348]: 🆓
            - generic [ref=e349]: No login needed
            - generic [ref=e350]: No account, no email, no credit card.
          - generic [ref=e351]:
            - generic [ref=e352]: ✏️
            - generic [ref=e353]: Fully editable fields
            - generic [ref=e354]: Every field on the receipt is customisable.
      - generic [ref=e356]:
        - heading "How to Generate a Fuel Bill" [level=2] [ref=e357]
        - generic [ref=e358]:
          - generic [ref=e359]:
            - generic [ref=e361]: "1"
            - generic [ref=e362]:
              - generic [ref=e363]: Choose a template
              - generic [ref=e364]: Select from Thermal Full, Classic POS, IOCL Formal, or Thermal Compact.
          - generic [ref=e365]:
            - generic [ref=e367]: "2"
            - generic [ref=e368]:
              - generic [ref=e369]: Fill in station details
              - generic [ref=e370]: Enter the petrol station name, address, and branding details.
          - generic [ref=e371]:
            - generic [ref=e373]: "3"
            - generic [ref=e374]:
              - generic [ref=e375]: Enter transaction details
              - generic [ref=e376]: Add date, time, fuel type, quantity, rate per litre.
          - generic [ref=e377]:
            - generic [ref=e379]: "4"
            - generic [ref=e380]:
              - generic [ref=e381]: Add vehicle info
              - generic [ref=e382]: Enter vehicle registration number and attendant details.
          - generic [ref=e383]:
            - generic [ref=e385]: "5"
            - generic [ref=e386]:
              - generic [ref=e387]: Preview your bill
              - generic [ref=e388]: Check the live preview. Every field updates instantly.
          - generic [ref=e389]:
            - generic [ref=e390]: "6"
            - generic [ref=e391]:
              - generic [ref=e392]: Download PDF
              - generic [ref=e393]: Click Save PDF to download the receipt directly to your device.
      - generic [ref=e395]:
        - heading "Benefits of Using OpsTools Fuel Bill Generator" [level=2] [ref=e396]
        - list [ref=e397]:
          - listitem [ref=e398]:
            - generic [ref=e399]: ✓
            - generic [ref=e400]: Generate unlimited fuel bills — no caps or credit limits.
          - listitem [ref=e401]:
            - generic [ref=e402]: ✓
            - generic [ref=e403]: No registration or sign-up required.
          - listitem [ref=e404]:
            - generic [ref=e405]: ✓
            - generic [ref=e406]: Direct PDF download — no print dialog.
          - listitem [ref=e407]:
            - generic [ref=e408]: ✓
            - generic [ref=e409]: Four templates match actual Indian petrol station formats.
          - listitem [ref=e410]:
            - generic [ref=e411]: ✓
            - generic [ref=e412]: All data stays in your browser — zero privacy risk.
          - listitem [ref=e413]:
            - generic [ref=e414]: ✓
            - generic [ref=e415]: Completely free — no subscription.
      - generic [ref=e417]:
        - heading "Fuel Bill Format — Key Fields" [level=2] [ref=e418]
        - paragraph [ref=e419]: "A standard fuel bill in India contains the following fields. All are available in our generator:"
        - table [ref=e421]:
          - rowgroup [ref=e422]:
            - row "Field Description Example" [ref=e423]:
              - columnheader "Field" [ref=e424]
              - columnheader "Description" [ref=e425]
              - columnheader "Example" [ref=e426]
          - rowgroup [ref=e427]:
            - row "Station Name Name of the petrol pump Indian Oil — Sharma Fuels" [ref=e428]:
              - cell "Station Name" [ref=e429]:
                - strong [ref=e430]: Station Name
              - cell "Name of the petrol pump" [ref=e431]
              - cell "Indian Oil — Sharma Fuels" [ref=e432]
            - row "Station Address Full address of the petrol station Plot 12, MG Road, Pune 411001" [ref=e433]:
              - cell "Station Address" [ref=e434]:
                - strong [ref=e435]: Station Address
              - cell "Full address of the petrol station" [ref=e436]
              - cell "Plot 12, MG Road, Pune 411001" [ref=e437]
            - row "Date & Time Date and time of the transaction 20/06/2026 — 14:35" [ref=e438]:
              - cell "Date & Time" [ref=e439]:
                - strong [ref=e440]: Date & Time
              - cell "Date and time of the transaction" [ref=e441]
              - cell "20/06/2026 — 14:35" [ref=e442]
            - row "Fuel Type Type of fuel dispensed Petrol / Diesel / CNG" [ref=e443]:
              - cell "Fuel Type" [ref=e444]:
                - strong [ref=e445]: Fuel Type
              - cell "Type of fuel dispensed" [ref=e446]
              - cell "Petrol / Diesel / CNG" [ref=e447]
            - row "Quantity Volume dispensed in litres 5.00 L" [ref=e448]:
              - cell "Quantity" [ref=e449]:
                - strong [ref=e450]: Quantity
              - cell "Volume dispensed in litres" [ref=e451]
              - cell "5.00 L" [ref=e452]
            - row "Rate per Litre Price per litre at time of transaction ₹103.44" [ref=e453]:
              - cell "Rate per Litre" [ref=e454]:
                - strong [ref=e455]: Rate per Litre
              - cell "Price per litre at time of transaction" [ref=e456]
              - cell "₹103.44" [ref=e457]
            - row "Total Amount Total value of the transaction ₹517.20" [ref=e458]:
              - cell "Total Amount" [ref=e459]:
                - strong [ref=e460]: Total Amount
              - cell "Total value of the transaction" [ref=e461]
              - cell "₹517.20" [ref=e462]
            - row "Vehicle Number Registration number of the vehicle MH 12 AB 1234" [ref=e463]:
              - cell "Vehicle Number" [ref=e464]:
                - strong [ref=e465]: Vehicle Number
              - cell "Registration number of the vehicle" [ref=e466]
              - cell "MH 12 AB 1234" [ref=e467]
      - generic [ref=e469]:
        - heading "Frequently Asked Questions" [level=2] [ref=e470]
        - generic [ref=e471]:
          - button "Is this fuel bill generator free to use? +" [ref=e473] [cursor=pointer]:
            - generic [ref=e474]: Is this fuel bill generator free to use?
            - generic [ref=e475]: +
          - button "Can I use this fuel bill for office reimbursement? +" [ref=e477] [cursor=pointer]:
            - generic [ref=e478]: Can I use this fuel bill for office reimbursement?
            - generic [ref=e479]: +
          - button "Does this generate a PDF? +" [ref=e481] [cursor=pointer]:
            - generic [ref=e482]: Does this generate a PDF?
            - generic [ref=e483]: +
      - generic [ref=e485]:
        - heading "Related Documents" [level=2] [ref=e486]
        - paragraph [ref=e487]: Looking for other business documents? OpsTools has you covered.
        - generic [ref=e488]:
          - link "Rent Receipt Generator HRA-compliant rent receipts." [ref=e489] [cursor=pointer]:
            - /url: /documents/rent-receipt
            - generic [ref=e490]: Rent Receipt Generator
            - generic [ref=e491]: HRA-compliant rent receipts.
          - link "GST Invoice Generator Tax-compliant GST invoices." [ref=e492] [cursor=pointer]:
            - /url: /documents/gst-invoice
            - generic [ref=e493]: GST Invoice Generator
            - generic [ref=e494]: Tax-compliant GST invoices.
          - link "Salary Slip Generator Professional payslips." [ref=e495] [cursor=pointer]:
            - /url: /documents/salary-slip
            - generic [ref=e496]: Salary Slip Generator
            - generic [ref=e497]: Professional payslips.
  - contentinfo [ref=e498]:
    - generic [ref=e499]:
      - generic [ref=e500]:
        - link "OpsTools" [ref=e501] [cursor=pointer]:
          - /url: /
          - img [ref=e502]
          - generic [ref=e513]: OpsTools
        - paragraph [ref=e514]: Free business document tools built for Indian small businesses — fuel bills, rent receipts, invoices, and more.
        - generic [ref=e515]:
          - generic [ref=e516]: Did you know
          - text: Templates are based on real Indian petrol station and rental receipts.
      - generic [ref=e517]:
        - heading "Tools" [level=3] [ref=e518]
        - list [ref=e519]:
          - listitem [ref=e520]:
            - link "Fuel Bill Generator" [ref=e521] [cursor=pointer]:
              - /url: /documents/fuel-bill
          - listitem [ref=e522]:
            - link "Rent Receipt" [ref=e523] [cursor=pointer]:
              - /url: /documents/rent-receipt
          - listitem [ref=e524]:
            - link "GST Invoice Soon" [ref=e525] [cursor=pointer]:
              - /url: /documents/fuel-bill
              - text: GST Invoice
              - generic [ref=e526]: Soon
          - listitem [ref=e527]:
            - link "Salary Slip Soon" [ref=e528] [cursor=pointer]:
              - /url: /documents/fuel-bill
              - text: Salary Slip
              - generic [ref=e529]: Soon
      - generic [ref=e530]:
        - heading "Company" [level=3] [ref=e531]
        - list [ref=e532]:
          - listitem [ref=e533]:
            - link "About OpsTools" [ref=e534] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e535]:
            - link "What's planned" [ref=e536] [cursor=pointer]:
              - /url: /about#roadmap
          - listitem [ref=e537]:
            - link "Contact us" [ref=e538] [cursor=pointer]:
              - /url: /about#contact
      - generic [ref=e539]:
        - heading "Resources" [level=3] [ref=e540]
        - list [ref=e541]:
          - listitem [ref=e542]:
            - link "How to save as PDF" [ref=e543] [cursor=pointer]:
              - /url: /documents/fuel-bill
          - listitem [ref=e544]:
            - link "What is HRA?" [ref=e545] [cursor=pointer]:
              - /url: /documents/fuel-bill
          - listitem [ref=e546]:
            - link "GST for small business" [ref=e547] [cursor=pointer]:
              - /url: /documents/fuel-bill
    - generic [ref=e549]:
      - generic [ref=e550]: © 2026 OpsTools — free for Indian small businesses
      - generic [ref=e551]:
        - link "Privacy" [ref=e552] [cursor=pointer]:
          - /url: /about
        - link "Terms" [ref=e553] [cursor=pointer]:
          - /url: /about
        - generic [ref=e554]:
          - text: Made with
          - generic [ref=e555]: ♥
          - text: in India
    - generic:
      - img
      - generic: OpsTools
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Fuel Bill Generator", () => {
  4   | 
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto("/documents/fuel-bill");
  7   |     // Wait for page to fully load
  8   |     await page.waitForLoadState("networkidle");
  9   |   });
  10  | 
  11  |   test("page loads with correct title", async ({ page }) => {
  12  |     await expect(page).toHaveTitle(/Fuel Bill/i);
  13  |   });
  14  | 
  15  |   test("hero heading is visible", async ({ page }) => {
  16  |     await expect(page.getByRole("heading", { name: /Free Fuel Bill Generator/i })).toBeVisible();
  17  |   });
  18  | 
  19  |   test("all 4 templates are shown", async ({ page }) => {
  20  |     // Scope to the template picker section — buttons, not SEO content
  21  |     const picker = page.locator(".no-print").first();
  22  |     await expect(page.getByRole("button", { name: /Thermal Full/i }).first()).toBeVisible();
  23  |     await expect(page.getByRole("button", { name: /Classic POS/i }).first()).toBeVisible();
  24  |     await expect(page.getByRole("button", { name: /IOCL Formal/i }).first()).toBeVisible();
  25  |     await expect(page.getByRole("button", { name: /Thermal Compact/i }).first()).toBeVisible();
  26  |   });
  27  | 
  28  |   test("Thermal Full is selected by default", async ({ page }) => {
  29  |     const thermalBtn = page.getByRole("button", { name: /Thermal Full Dot-matrix/i });
  30  |     await expect(thermalBtn).toBeVisible();
  31  |     await expect(thermalBtn).toHaveClass(/border-\[#2563EB\]/);
  32  |   });
  33  | 
  34  |   test("clicking Classic POS switches template", async ({ page }) => {
  35  |     await page.getByRole("button", { name: /Classic POS Monospace/i }).click();
  36  |     await expect(page.getByText("ORIGINAL")).toBeVisible();
  37  |   });
  38  | 
  39  |   test("clicking IOCL Formal switches template", async ({ page }) => {
  40  |     await page.getByRole("button", { name: /IOCL Formal Logo/i }).click();
  41  |     await expect(page.getByText("TOTAL AMOUNT:")).toBeVisible();
  42  |   });
  43  | 
  44  |   test("live preview updates when station name is changed", async ({ page }) => {
  45  |     const input = page.locator('input[name="stationName"]');
  46  |     await input.clear();
  47  |     await input.fill("MY TEST PUMP");
  48  |     await expect(page.getByText("MY TEST PUMP").first()).toBeVisible();
  49  |   });
  50  | 
  51  |   test("live preview updates when quantity is entered", async ({ page }) => {
  52  |     const qtyInput = page.locator('input[name="quantity"]');
  53  |     await qtyInput.fill("10");
  54  |     await expect(page.getByText(/1042/).first()).toBeVisible();
  55  |   });
  56  | 
  57  |   test("form sections are collapsible", async ({ page }) => {
  58  |     // Click the Bill Details section button to collapse it
  59  |     const billDetailsBtn = page.getByRole("button", { name: /🧾 Bill Details/i });
  60  |     await expect(billDetailsBtn).toBeVisible();
  61  |     await billDetailsBtn.click();
  62  |     // After collapse, the date input should be hidden (grid-template-rows: 0fr)
  63  |     // Check the parent container has collapsed
  64  |     await page.waitForTimeout(400); // wait for CSS transition
  65  |     const dateInput = page.locator('input[name="billDate"]');
  66  |     const box = await dateInput.boundingBox();
> 67  |     expect(box?.height ?? 0).toBeLessThanOrEqual(1);
      |                              ^ Error: expect(received).toBeLessThanOrEqual(expected)
  68  |   });
  69  | 
  70  |   test("Save PDF button is visible next to Live Preview", async ({ page }) => {
  71  |     // Use exact label text scoped to the preview header
  72  |     await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
  73  |     await expect(page.getByRole("button", { name: /Save PDF/i })).toBeVisible();
  74  |   });
  75  | 
  76  |   test("Generate in Bulk button is visible in hero", async ({ page }) => {
  77  |     await expect(page.getByRole("button", { name: /Generate in Bulk/i })).toBeVisible();
  78  |   });
  79  | 
  80  |   test("Generate in Bulk shows login modal for guest", async ({ page }) => {
  81  |     await page.getByRole("button", { name: /Generate in Bulk/i }).click();
  82  |     await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
  83  |   });
  84  | 
  85  |   test("login modal has Log in and Sign up buttons", async ({ page }) => {
  86  |     await page.getByRole("button", { name: /Generate in Bulk/i }).click();
  87  |     // Scope to the modal — find the dialog/modal container
  88  |     const modal = page.locator('[style*="position: fixed"]').last();
  89  |     await expect(modal.getByRole("link", { name: "Log in" })).toBeVisible();
  90  |     await expect(modal.getByRole("link", { name: /Sign up free/i })).toBeVisible();
  91  |   });
  92  | 
  93  |   test("modal closes on backdrop click", async ({ page }) => {
  94  |     await page.getByRole("button", { name: /Generate in Bulk/i }).click();
  95  |     await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
  96  |     await page.mouse.click(10, 10);
  97  |     await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).not.toBeVisible();
  98  |   });
  99  | 
  100 |   test("modal closes on Escape key", async ({ page }) => {
  101 |     await page.getByRole("button", { name: /Generate in Bulk/i }).click();
  102 |     await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
  103 |     await page.keyboard.press("Escape");
  104 |     await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).not.toBeVisible();
  105 |   });
  106 | 
  107 |   test("SEO content section is present", async ({ page }) => {
  108 |     await expect(page.getByRole("heading", { name: /What is a Fuel Bill/i })).toBeVisible();
  109 |   });
  110 | 
  111 |   test("FAQ section is present and expandable", async ({ page }) => {
  112 |     const faqQ = page.getByText(/Is this fuel bill generator free/i).first();
  113 |     await expect(faqQ).toBeVisible();
  114 |     await faqQ.click();
  115 |     // After expanding, the answer div becomes visible — use exact answer text
  116 |     await expect(page.getByText("Yes, completely free with no login required.")).toBeVisible();
  117 |   });
  118 | });
  119 | 
```