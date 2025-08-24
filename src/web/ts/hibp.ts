/**
 * Check the password against the Have I Been Pwned database.
 * The password is SHA1 hashed here, and only the first 5 characters
 * of the hash are sent to the API. The password is never logged, saved
 * or sent anywhere.
 */

import * as crypto from 'crypto';

/**
 * Check for a match in the HIBP Database
 */
export async function check(password: string) {
    const result = {
        success: false,
        statusCode: 500,
        match: false,
        frequency: 0,
        message: 'Internal Error',
    };
    try {
        if (!password) {
            result.message = 'Password must not be empty';
            result.statusCode = 400;
            return result;
        }
        const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            mode: 'cors',
            headers: {
                'user-agent': 'pwd-check-demo',
            },
        });
        const text = await response.text();

        if (response.ok) {
            /**
             * API returns a text list of matching hashes and frequency like:
             * 0018A45C4D1DEF81644B54AB7F969B88D65:3
             * 00D4F6E8FA6EECAD2A3AA415EEC418D38EC:3
             */
            const list = text.split('\n');
            const match = list.find((item) => item.includes(suffix));
            const frequency = (match) ? Number(match.slice(match.indexOf(':') + 1)) : 0;

            return {
                success: true,
                statusCode: response.status,
                match: Boolean(match),
                frequency,
                message: (match) ? `The password appears ${frequency} times in well known data leaks` : 'The password was not found in well known data leaks',
            };
        }
        return {
            ...result,
            statusCode: response.status,
            message: text,
        };
    } catch (err) {
        console.error('Error checking password against HIBP:', err);
        return result;
    }
}
