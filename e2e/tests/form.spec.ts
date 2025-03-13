import { test } from '../fixtures/screenshot-on-failure'
import { generateValidFormDataForForm } from "../utils/dataGenerator";
import { FormPage } from "../pages/formPage";

test.describe("Form Practice Page", () => {

    test("should fill the form with valid data", async ({ page }) => {

        const formPage = new FormPage(page)

        const formData = generateValidFormDataForForm()
        await formPage.navigate()
        await formPage.fillForm(formData)
        await formPage.submitForm()
        await formPage.validateFormSubmission(formData)

    })

})