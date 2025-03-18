import { generateValidFormDataForTextBox } from "../utils/dataGenerator";
import { TextBoxPage } from "../pages/textBoxPage";
import { test } from '../fixtures/test'
import { Severity } from "allure-js-commons";
import { allure } from "allure-playwright";

test.describe("Text Box Page", () => {

    test("should fill the form with valid data", async ({ page, logger }) => {

        logger.info("Setup Allure configuration")
        allure.severity(Severity.NORMAL)

        logger.info("Create a new instance of BoxPage")
        const textBoxPage = new TextBoxPage(page, logger)

        const formData = generateValidFormDataForTextBox({ logger })
        await textBoxPage.navigate()
        await textBoxPage.fillForm(formData)
        await textBoxPage.submitForm()
        await textBoxPage.validateFormSubmission(formData)

    })

})