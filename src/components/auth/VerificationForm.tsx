import React, { useRef, useState, useEffect } from 'react';

interface VerificationFormProps {
    length?: number;
    onComplete: (code: string) => void;
    disabled?: boolean;
}

export default function VerificationForm({ length = 6, onComplete, disabled = false }: VerificationFormProps) {
    const [code, setCode] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0] && !disabled) {
            inputRefs.current[0].focus();
        }
    }, [disabled]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;

        const value = e.target.value;
        if (isNaN(Number(value))) return;

        const newCode = [...code];
        // Only take the last character if multiple characters are pasted
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);

        // Handle paste event
        if (value.length > 1) {
            const pastedValue = value.split('').slice(0, length - index);
            pastedValue.forEach((char, i) => {
                if (index + i < length) {
                    newCode[index + i] = char;
                    if (inputRefs.current[index + i]) {
                        inputRefs.current[index + i]!.value = char;
                    }
                }
            });
            setCode(newCode);

            // Move focus to the next empty input or the last input
            const nextEmptyIndex = newCode.findIndex((val, i) => i > index && !val);
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        } else if (value && index < length - 1) {
            // Move to next input if value is entered
            inputRefs.current[index + 1]?.focus();
        }

        // Check if OTP is complete
        const codeValue = newCode.join('');
        if (codeValue.length === length) {
            onComplete(codeValue);
            console.log("Code: ", codeValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;

        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                // Move to previous input on backspace if current input is empty
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        e.preventDefault();
        const pastedValue = e.clipboardData.getData('text');
        const newCode = [...code];
        for (let i = 0; i < length; i++) {
            if (i < pastedValue.length) {
                newCode[i] = pastedValue[i];
            } else {
                newCode[i] = '';
            }
        }
        setCode(newCode);
        onComplete(newCode.join(''));
    }

    return (
        <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-8 aspect-square sm:w-12 text-blue-200 text-center text-2xl bg-gray-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-700'}
            ${digit ? 'border-blue-500' : ''}`}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
}