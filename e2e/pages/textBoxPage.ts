import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import {createTestLogger} from "../utils/logger";

export interface FormProps {
  fullName: string;
  email: string;
  currAddress: string;
  permanentAddress: string;
}

export class TextBoxPage extends BasePage {

  private fullNameInput: Locator;
  private emailInput: Locator;
  private currAddressInput: Locator;
  private permAddressInput: Locator;
  private fullNameOutput: Locator;
  private emailOutput: Locator;
  private currAddressOutput: Locator;
  private permAddressOutput: Locator;
  private submitButton: Locator;


  constructor(page: Page ,logger: ReturnType<typeof createTestLogger> ) {
    super(page , logger);

    // Define locators once and reuse them
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
    this.emailInput = page.getByRole('textbox', { name: 'name@example.com' });
    this.currAddressInput = page.getByRole('textbox', { name: 'Current Address' });
    this.permAddressInput = page.locator('#permanentAddress');

    this.submitButton = page.getByRole('button', { name: 'Submit' });

    this.fullNameOutput = page.locator('#output > div > #name')
    this.emailOutput = page.locator('#output > div > #email')
    this.currAddressOutput = page.locator('#output > div > #currentAddress')
    this.permAddressOutput = page.locator('#output > div > #permanentAddress');
  }

  async navigate() {

    this.logger.info("Navigate to the Text Box page")

    await this.page.goto('https://demoqa.com/text-box' , {waitUntil : 'commit'});
    await this.fullNameInput.waitFor();
  }

  async fillForm(formData: FormProps) {
    this.logger.info("Filling the form with data")
    await this.fullNameInput.fill(formData.fullName);
    await this.emailInput.fill(formData.email);
    await this.currAddressInput.fill(formData.currAddress);
    await this.permAddressInput.fill(formData.permanentAddress);
  }

  async submitForm() {
    this.logger.info("Submitting the form")
    await this.submitButton.click();
  }

  async validateFormSubmission(formData: FormProps) {
    this.logger.info("Validating the form submission")
    await expect(this.fullNameOutput).toContainText(formData.fullName);
    await expect(this.emailOutput).toContainText(formData.email);
    await expect(this.currAddressOutput).toContainText(formData.currAddress);
    await expect(this.permAddressOutput).toContainText(formData.permanentAddress);
  }

}
