// 标准验证
export const normValidator = (rule: any, value: string, regExp: RegExp, warnMessage: string) => {
  if (value) {
    if (regExp.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject(warnMessage)
    }
  } else {
    return Promise.resolve()
  }
}

// 验证数字及其规则
export const numberValidator = (rule: any, value: string, regExp: RegExp, warnMessage: string) => {
  if (value) {
    if (Number.isNaN(Number(value)) || !regExp.test(value)) {
      return Promise.reject(warnMessage)
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}

// 验证最小数字
export const minNumberValidator = (rule: any, value: string, minNumber: number, warnMessage: string) => {
  if (value) {
    if (Number(value) <= minNumber) {
      return Promise.reject(warnMessage)
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}

// 验证最大数字
export const maxNumberValidator = (rule: any, value: string, maxNumber: number, warnMessage: string) => {
  if (value) {
    if (Number(value) > maxNumber) {
      return Promise.reject(warnMessage)
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}
