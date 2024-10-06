Feature: Basic Test

  Scenario: It works
    Given I run the tests
    Then the tests should pass

  Scenario: It has a world
    Given I have a number 2
    And I have a number 3
    Then the sum should be 5

  Rule: Every step must have access to information about itself
    This is so we can know what is happening!

    @tag-test
    Example: The world has info
      Given I run the tests
      Then the test "feature" should include "Basic Test"
      And the test "rule" should include "Every step must have access to information about itself"
      And the test "scenario" should include "The world has info"
      And the test "tags" should include "@tag-test"
      And the test "step" should include 'the test "step" should include'
      And the test "line" should include "23"