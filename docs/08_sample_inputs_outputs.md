# Sample Inputs & Outputs

## Example Requirement

User should be able to log into the application using email and password.

Invalid credentials should show an error message.

---

## Generated Test Case

TC001

Title
Login with valid credentials

Steps

1 Open login page
2 Enter valid email
3 Enter valid password
4 Click login

Expected Result

User is redirected to dashboard.

---

## Generated Gherkin

Feature: Login

Scenario: Successful login

Given user is on login page
When user enters valid credentials
Then user should be redirected to dashboard

---

## Generated Step Definition

@Given("user is on login page")
public void user_is_on_login_page() {

}

@When("user enters valid credentials")
public void user_enters_valid_credentials() {

}

@Then("user should be redirected to dashboard")
public void user_redirected_to_dashboard() {

}
