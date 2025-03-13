import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";

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

  constructor(page: Page) {
    super(page);

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
    await this.page.goto('https://demoqa.com/text-box' , {waitUntil : 'commit'});
    await this.fullNameInput.waitFor();
  }

  async fillForm(formData: FormProps) {
    await this.fullNameInput.fill(formData.fullName);
    await this.emailInput.fill(formData.email);
    await this.currAddressInput.fill(formData.currAddress);
    await this.permAddressInput.fill(formData.permanentAddress);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async validateFormSubmission(formData: FormProps) {
    await expect(this.fullNameOutput).toContainText(formData.fullName);
    await expect(this.emailOutput).toContainText(formData.email);
    await expect(this.currAddressOutput).toContainText(formData.currAddress);
    await expect(this.permAddressOutput).toContainText(formData.permanentAddress);
  }

}
