function validator(option) {
    var formElement = document.querySelector('#form-1')
    var selectorRules = {}

    formElement.addEventListener('submit', (e)=> {
        e.preventDefault()
        var isFormValid = true

        option.rules.forEach((rule)=> {
            var inputElement = formElement.querySelector(rule.selector)
            var isValid = validate(inputElement, rule)

            if(!isValid) {
                isFormValid = false
            }
        })
            if(isFormValid) {
                if(typeof option.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]')
                    var formValue = Array.from(enableInput).reduce((value, input)=> {
                        value[input.name] = input.value
                        return value
                    }, {})
                } else {
                    formElement.submit()
                }

                 option.onSubmit(formValue)
            }
    })

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(option.formMessage)
        var errorMessage
        var rules = selectorRules[rule.selector]

        for(var i = 0; i < rules.length; i++) {
            errorMessage= rules[i](inputElement.value)
            if(errorMessage) break
        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
        
        return !errorMessage
    }

    option.rules.forEach((rule)=> {
        var inputElement = formElement.querySelector(rule.selector)
        inputElement.addEventListener('blur', ()=> {
            var inputElement = formElement.querySelector(rule.selector)
                validate(inputElement, rule)
        })

        if(Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector] = [rule.test]
        }
        
        inputElement.addEventListener('input', ()=> {
            var errorElement = inputElement.parentElement.querySelector(option.formMessage)
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        })
    })
}




validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            return regex.test(value) ? undefined : 'Vui lòng nhập Email'
        }
    }
}

validator.isPassword = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
          return value.length >= min ? undefined : `Vui lòng nhập đủ ${min} kí tự`
        }
    }
}

validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
          return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không đúng'
        }
    }
}
