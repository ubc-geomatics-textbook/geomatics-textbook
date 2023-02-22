name: Suggestions
description: Suggest an improvement
title: "[Suggestion]: "
labels: ["suggestion"]
assignees:
  - pauldpickell
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to submit a suggestion!
  - type: input
    id: contact
    attributes:
      label: Contact details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  - type: input
    id: chapter-location
    attributes:
      label: Which chapter?
      description: Let us know the chapter your suggestion apply to, or if a general suggestion, you can just say "general"
      placeholder: Chapter 18
    validations:
      required: true
  - type: textarea
    id: suggestion-description
    attributes:
      label: Your suggestion
      description: Please add your suggestion here
    validations:
      required: true
  - type: checkboxes
    id: PR
    attributes:
      label: Planning to contribute?
      description: Let us know if you plan to add your suggestion to the project by submitting a pull request!
      options:
        - label: Yes, I plan to contribute by submitting a pull request
        - label: No, I do not plan to contribute
        

