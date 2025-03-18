import { test } from '../fixtures/test'
import { generateValidFormDataForForm } from "../utils/dataGenerator";
import { FormPage } from "../pages/formPage";
import { Severity } from "allure-js-commons";
import { allure } from "allure-playwright";

test.describe("Form Practice Page", () => {

    test("should fill the form with valid data", async ({ page , logger }, testInfo) => {

        
        logger.info("Setup Allure configuration")
        allure.severity(Severity.CRITICAL)

        logger.info("Create a new instance of FormPage")
        const formPage = new FormPage(page , logger)

        
        const formData = generateValidFormDataForForm({logger})
        await formPage.navigate()
        await formPage.fillForm(formData)
        await formPage.submitForm()
        await formPage.validateFormSubmission(formData)

    })

})