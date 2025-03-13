import { faker } from "@faker-js/faker";
import { HobbiesType } from "../pages/formPage";
import { format } from 'date-fns';

export function generateValidFormDataForTextBox() {
    const fullName = faker.person.fullName();
    const email = faker.internet.email();
    const currAddress = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`;
    const formData = { fullName, email, currAddress, permanentAddress: currAddress }

    return formData
}

export function generateValidFormDataForForm(){

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const gender = faker.person.sex();
    const mobileNo = '1234567890';
    const dob = faker.date.birthdate({ min: 18, max: 60, mode: 'age' });
    const subject = "Chem"
    const hobbies: HobbiesType[] = ['Music' , 'Reading']
    const filePath = './e2e/assets/cat.jpeg'
    const currAddress = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`;
    const state = 'NCR'
    const city = 'Delhi'

    return {firstName , lastName , email , gender , mobileNo , dob , subject , hobbies , filePath , currAddress , state , city}

}