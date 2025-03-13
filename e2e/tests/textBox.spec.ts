import { test, expect } from "@playwright/test";
import { generateValidFormDataForTextBox } from "../utils/dataGenerator";
import { TextBoxPage } from "../pages/textBoxPage";

test.describe("Text Box Page", () => {

    test("should fill the form with valid data", async ({ page }) => {

        const textBoxPage = new TextBoxPage(page)

        const formData = generateValidFormDataForTextBox()
        await textBoxPage.navigate()
        await textBoxPage.fillForm(formData)
        await textBoxPage.submitForm()
        await textBoxPage.validateFormSubmission(formData)

    })

})