import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { format } from "date-fns/format";

export interface FormProps {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobileNo: string;
  dob: Date;
  subject: string;
  hobbies: HobbiesType[];
  filePath: string;
  currAddress: string;
  state: string;
  city: string;
}

export type HobbiesType = "Sports" | "Reading" | "Music";

export class FormPage extends BasePage {

  private formHeading: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private emailInput: Locator;
  private gender: { 'male': Locator, 'female': Locator, 'other': Locator };
  private mobileNoInput: Locator;
  private dobInput: Locator;
  private dateInput: Locator;
  private subjectInput: Locator;
  private subjectInputOption: Locator;
  private hobbies: { 'Sports': Locator, 'Reading': Locator, 'Music': Locator };
  private pictureInput: Locator;
  private currAddressInput: Locator;
  private stateInput: Locator;
  private cityInput: Locator;
  private submitButton: Locator;
  private outputHeading: Locator;
  private nameOutput: Locator;
  private emailOuput: Locator;
  private genderOutput: Locator;
  private mobileNoOutput: Locator;
  private dobOutput: Locator;
  private subjectOutput: Locator;
  private hobbiesOutput: Locator;
  private pictureOutput: Locator;
  private currAddressOutput: Locator;
  private stateAndCityOutput: Locator;

  constructor(page: Page) {
    super(page);

    // Define locators once and reuse them

    this.formHeading = page.getByRole('heading', { name: 'Student Registration Form' })
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' })
    this.emailInput = page.getByRole('textbox', { name: 'name@example.com' })

    // Gender Locators
    const maleRadioInput = page.getByText('Male', { exact: true })
    const femaleRadioInput = page.getByText('Female', { exact: true })
    const otherRadioInput = page.getByText('Other', { exact: true })

    this.gender = { 'male': maleRadioInput, 'female': femaleRadioInput, 'other': otherRadioInput }

    this.mobileNoInput = page.getByRole('textbox', { name: 'Mobile Number' })
    this.dobInput = page.locator('#dateOfBirthInput')
    this.dateInput = page.locator('.react-datepicker__day--selected')

    this.subjectInput = page.locator('#subjectsInput')
    this.subjectInputOption = page.getByText('Chemistry', { exact: true })

    // Hobbies Locators

    const sportsCheckboxInput = page.getByText('Sports')
    const readingCheckboxInput = page.getByText('Reading')
    const musicCheckboxInput = page.getByText('Music')

    this.hobbies = { 'Sports': sportsCheckboxInput, 'Reading': readingCheckboxInput, 'Music': musicCheckboxInput }

    this.pictureInput = page.getByRole('textbox', { name: 'Select picture' })
    this.currAddressInput = page.getByRole('textbox', { name: 'Current Address' })
    this.stateInput = page.getByText('Select State')
    this.cityInput = page.getByText('Select City')


    this.submitButton = page.getByRole('button', { name: 'Submit' })

    // Output

    this.outputHeading = page.getByText('Thanks for submitting the form')
    this.nameOutput = this.getTableValue('Student Name');
    this.emailOuput = this.getTableValue('Student Email');
    this.genderOutput = this.getTableValue('Gender');
    this.mobileNoOutput = this.getTableValue('Mobile');
    this.dobOutput = this.getTableValue('Date of Birth');
    this.subjectOutput = this.getTableValue('Subjects');
    this.hobbiesOutput = this.getTableValue('Hobbies');
    this.pictureOutput = this.getTableValue('Picture');
    this.currAddressOutput = this.getTableValue('Address');
    this.stateAndCityOutput = this.getTableValue('State and City');

  }

  private getTableValue(label: string) {
    return this.page.locator(`//tr[td[text()='${label}']]/td[2]`);
  }


  async navigate() {
    await this.page.goto('https://demoqa.com/automation-practice-form', { waitUntil: 'commit' });
    await this.formHeading.waitFor()
  }


  async fillForm(formData: FormProps) {

    await this.firstNameInput.fill(formData.firstName)
    await this.lastNameInput.fill(formData.lastName)
    await this.emailInput.fill(formData.email)

    await this.gender[formData.gender].click()

    await this.mobileNoInput.fill(formData.mobileNo)
    await this.dobInput.fill(format(formData.dob, 'dd MMM yyyy'))
    await this.dateInput.click()

    await this.subjectInput.fill(formData.subject)
    await this.subjectInputOption.click()


    await Promise.all(formData.hobbies.map(hobby => this.hobbies[hobby].click()));

    await this.pictureInput.setInputFiles(formData.filePath);
    await this.currAddressInput.fill(formData.currAddress)

    await this.stateInput.click()
    await this.page.getByText(formData.state, { exact: true }).click();
    
    await this.cityInput.click()
    await this.page.getByText(formData.city, { exact: true }).click();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async validateFormSubmission(formData: FormProps) {

    await this.outputHeading.waitFor();

    await expect(this.nameOutput).toContainText(`${formData.firstName} ${formData.lastName}`)
    await expect(this.emailOuput).toContainText(formData.email)
    await expect(this.genderOutput).toContainText(`${formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}`)
    await expect(this.mobileNoOutput).toContainText(formData.mobileNo)
    await expect(this.dobOutput).toContainText(format(formData.dob, "dd MMMM,yyyy"))
    await expect(this.subjectOutput).toContainText(formData.subject)
    await expect(this.hobbiesOutput).toContainText(`${formData.hobbies.join(', ')}`)
    await expect(this.pictureOutput).toContainText(`${formData.filePath.split('/').pop()}`)
    await expect(this.currAddressOutput).toContainText(formData.currAddress)
    await expect(this.stateAndCityOutput).toContainText(`${formData.state} ${formData.city}`)

  }

}
