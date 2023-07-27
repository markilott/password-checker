import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

/** Check common complexity requirements: one lowercase, one uppercase, one number, one symbol, length at least 8 characters */
export function isComplex(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexResult = regex.test(password);
    return {
        result: regexResult,
        message: (regexResult) ? 'This password meets typical complexity requirements (which does not mean it is secure)' : 'This password does not meet typical complexity requirements (which does not mean it is insecure)',
    };
}

export function check(password: string) {
    // Check crackability using the zxcvbn library
    const options = {
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
        },
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        translations: zxcvbnEnPackage.translations,
    };
    zxcvbnOptions.setOptions(options);

    const { crackTimesDisplay, score, feedback } = zxcvbn(password);
    const { offlineFastHashing1e10PerSecond, offlineSlowHashing1e4PerSecond } = crackTimesDisplay;
    const { warning = '', suggestions } = feedback;

    let scoreMsg = '';
    switch (score) {
        case 0: scoreMsg = 'too guessable'; break;
        case 1: scoreMsg = 'very guessable'; break;
        case 2: scoreMsg = 'somewhat guessable'; break;
        case 3: scoreMsg = 'safely unguessable'; break;
        case 4: scoreMsg = 'very unguessable'; break;
        default: scoreMsg = 'impossible to analyse';
    }

    return {
        score,
        scoreMessage: `Password is ${scoreMsg}`,
        timeMessage: (offlineFastHashing1e10PerSecond === offlineSlowHashing1e4PerSecond) ? `If your password is stolen it will take ${offlineFastHashing1e10PerSecond} to crack` : `If your password is stolen, it will take between ${offlineFastHashing1e10PerSecond} and ${offlineSlowHashing1e4PerSecond} to crack depending on the methods used to store the password.`,
        warning,
        suggestions,
    };
}
