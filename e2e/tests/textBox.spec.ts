import { generateValidFormDataForTextBox } from "../utils/dataGenerator";
import { TextBoxPage } from "../pages/textBoxPage";
import { test } from '../fixtures/screenshot-on-failure'
import { Severity } from "allure-js-commons";
import { allure } from "allure-playwright";

test.describe("Text Box Page", () => {

    test("should fill the form with valid data", async ({ page }) => {

        allure.severity(Severity.NORMAL)
        const textBoxPage = new TextBoxPage(page)

        const formData = generateValidFormDataForTextBox()
        await textBoxPage.navigate()
        await textBoxPage.fillForm(formData)
        await textBoxPage.submitForm()
        await textBoxPage.validateFormSubmission(formData)

    })

})