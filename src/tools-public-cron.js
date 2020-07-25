/**
 * 校验cron表达式
 * @param {String} 表达式
 * @returns {Boolean}
 */
let checkField = (field, minimal, maximal) => {
    if (field.includes('-')) {
        let startValue = field.substring(0, field.indexOf('-'))
        let endValue = field.substring(field.indexOf('-') + 1)
        if (!(checkIntValue(startValue, minimal, maximal, true) && checkIntValue(endValue, minimal, maximal, true))) {
            return false
        }
        try {
            let startVal = parseInt(startValue, 10)
            let endVal = parseInt(endValue, 10)
            return endVal > startVal
        } catch (e) {
            return false
        }
    } else if (field.includes(',')) {
        return checkListField(field, minimal, maximal)
    } else if (field.includes('/')) {
        return checkIncrementField(field, minimal, maximal)
    } else if (field.includes('*')) {
        return true
    } else {
        return checkIntValue(field, minimal, maximal)
    }
}
let checkIntValue = (value, minimal, maximal, checkExtremity) => {
    try {
        let val = parseInt(value, 10)
        // 判断是否为整数
        if (value - val === 0) {
            if (checkExtremity) {
                if (val < minimal || val > maximal) { return false }
            }
            return true
        }
        return false
    } catch (e) {
        return false
    }
}
let checkFieldWithLetter = (value, letter, minimalBefore, maximalBefore, minimalAfter, maximalAfter) => {
    let canBeAlone = false
    let canHaveIntBefore = false
    let canHaveIntAfter = false
    let mustHaveIntBefore = false
    let mustHaveIntAfter = false
    if (letter === 'L') {
        canBeAlone = true
        canHaveIntBefore = true
        canHaveIntAfter = false
        mustHaveIntBefore = false
        mustHaveIntAfter = false
    }
    if (letter === 'W' || letter === 'C') {
        canBeAlone = false
        canHaveIntBefore = true
        canHaveIntAfter = false
        mustHaveIntBefore = true
        mustHaveIntAfter = false
    }
    if (letter === '#') {
        canBeAlone = false
        canHaveIntBefore = true
        canHaveIntAfter = true
        mustHaveIntBefore = true
        mustHaveIntAfter = true
    }
    let beforeLetter = ''
    let afterLetter = ''
    if (value.includes(letter)) { beforeLetter = value.substring(0, value.indexOf(letter)) }
    if (!value.endsWith(letter)) { afterLetter = value.substring(value.indexOf(letter) + 1) }
    if (value.includes(letter)) {
        if (letter === value) { return canBeAlone }
        if (canHaveIntBefore) {
            if (mustHaveIntBefore && beforeLetter.length === 0) { return false }
            if (!checkIntValue(beforeLetter, minimalBefore, maximalBefore, true)) { return false }
        } else {
            if (beforeLetter.length > 0) { return false }
        }
        if (canHaveIntAfter) {
            if (mustHaveIntAfter && afterLetter.length === 0) { return false }
            if (!checkIntValue(afterLetter, minimalAfter, maximalAfter, true)) { return false }
        } else {
            if (afterLetter.length > 0) { return false }
        }
    }
    return true
}
let checkIncrementField = (value, minimal, maximal) => {
    let start = value.substring(0, value.indexOf('/'))
    let increment = value.substring(value.indexOf('/') + 1)
    if (!(start === '*')) {
        return checkIntValue(start, minimal, maximal, true) && checkIntValue(increment, minimal, maximal, false)
    } else {
        return checkIntValue(increment, minimal, maximal, true)
    }
}
let checkListField = (value, minimal, maximal) => {
    let values = value.split(',')
    let previousValue = -1
    for (let i = 0; i < values.length; i++) {
        let currentValue = values[i]
        if (!checkIntValue(currentValue, minimal, maximal, true)) { return false }
        try {
            let val = parseInt(currentValue, 10)
            if (val <= previousValue) {
                return false
            } else {
                previousValue = val
            }
        } catch (e) {
            // we have always an int
        }
    }
    return true
}
let checkSecondsField = (secondsField) => { return checkField(secondsField, 0, 59) }
let checkMinutesField = (minutesField) => { return checkField(minutesField, 0, 59) }
let checkHoursField = (hoursField) => { return checkField(hoursField, 0, 23) }
let checkDayOfMonthField = (dayOfMonthField) => {
    if (dayOfMonthField === '?') { return true }
    if (dayOfMonthField.includes('L')) {
        return checkFieldWithLetter(dayOfMonthField, 'L', 1, 7, -1, -1)
    } else if (dayOfMonthField.includes('W')) {
        return checkFieldWithLetter(dayOfMonthField, 'W', 1, 31, -1, -1)
    } else if (dayOfMonthField.includes('C')) {
        return checkFieldWithLetter(dayOfMonthField, 'C', 1, 31, -1, -1)
    } else {
        return checkField(dayOfMonthField, 1, 31)
    }
}
let checkMonthsField = (monthsField) => {
    monthsField.replace('JAN', '1')
    monthsField.replace('FEB', '2')
    monthsField.replace('MAR', '3')
    monthsField.replace('APR', '4')
    monthsField.replace('MAY', '5')
    monthsField.replace('JUN', '6')
    monthsField.replace('JUL', '7')
    monthsField.replace('AUG', '8')
    monthsField.replace('SEP', '9')
    monthsField.replace('OCT', '10')
    monthsField.replace('NOV', '11')
    monthsField.replace('DEC', '12')
    return checkField(monthsField, 1, 31)
}
let checkDayOfWeekField = (dayOfWeekField) => {
    dayOfWeekField = dayOfWeekField.replace('SUN', '1')
    dayOfWeekField = dayOfWeekField.replace('MON', '2')
    dayOfWeekField = dayOfWeekField.replace('TUE', '3')
    dayOfWeekField = dayOfWeekField.replace('WED', '4')
    dayOfWeekField = dayOfWeekField.replace('THU', '5')
    dayOfWeekField = dayOfWeekField.replace('FRI', '6')
    dayOfWeekField = dayOfWeekField.replace('SAT', '7')
    if (dayOfWeekField === '?') {
        return true
    }
    if (dayOfWeekField.indexOf('L') >= 0) {
        return checkFieldWithLetter(dayOfWeekField, 'L', 1, 7, -1, -1)
    } else if (dayOfWeekField.indexOf('C') >= 0) {
        return checkFieldWithLetter(dayOfWeekField, 'C', 1, 7, -1, -1)
    } else if (dayOfWeekField.indexOf('#') >= 0) {
        return checkFieldWithLetter(dayOfWeekField, '#', 1, 7, 1, 5)
    } else {
        return checkField(dayOfWeekField, 1, 7)
    }
}
let checkYearField = (yearField) => { return checkField(yearField, 1970, 2099) }
const cronValidate = (cronExpression) => {
    let cronParams = cronExpression.split(' ')
    if (cronParams.length < 6 || cronParams.length > 7) {
        return false
    }
    if (cronParams[3] === '?' || cronParams[5] === '?') {
        // Check seconds param
        if (!checkSecondsField(cronParams[0])) { return false }
        // Check minutes param
        if (!checkMinutesField(cronParams[1])) { return false }
        // Check hours param
        if (!checkHoursField(cronParams[2])) { return false }
        // Check day-of-month param
        if (!checkDayOfMonthField(cronParams[3])) { return false }
        // Check months param
        if (!checkMonthsField(cronParams[4])) { return false }
        // Check day-of-week param
        if (!checkDayOfWeekField(cronParams[5])) { return false }
        // Check year param
        if (cronParams.length === 7) {
        if (!checkYearField(cronParams[6])) { return false }
        }
        return true
    } else {
        return false
    }
}

module.exports = {
    cronValidate
}
