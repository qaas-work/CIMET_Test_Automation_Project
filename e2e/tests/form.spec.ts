import { test } from '../fixtures/screenshot-on-failure'
import { generateValidFormDataForForm } from "../utils/dataGenerator";
import { FormPage } from "../pages/formPage";
import { Severity } from "allure-js-commons";
import { allure } from "allure-playwright";

test.describe("Form Practice Page", () => {

    test("should fill the form with valid data", async ({ page }) => {

        allure.severity(Severity.CRITICAL)
        const formPage = new FormPage(page)

        const formData = generateValidFormDataForForm()
        await formPage.navigate()
        await formPage.fillForm(formData)
        await formPage.submitForm()
        await formPage.validateFormSubmission(formData)

    })

})