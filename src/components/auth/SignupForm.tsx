import React from 'react';
import { User, Lock, Mail, Building, GraduationCap, Eye, EyeOff, UserPlus, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import AuthModal from './AuthModal';
import { useSignupForm } from '../../hooks/useSignupForm';

interface SignupFormProps {
  onToggleForm: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const {
    studentNumber,
    password,
    firstName,
    lastName,
    email,
    selectedFaculty,
    selectedDepartment,
    selectedQualification,
    showPassword,
    isAgreement,
    validationErrors,
    isFormValid,
    showError,
    showRegistrationPopup,
    handleSubmit,
    handleRegistrationConfirm,
    handleInputChange,
    handleAgreementChange,
    facultyOptions,
    departmentOptions,
    qualificationOptions,
    setFirstName,
    setLastName,
    setShowPassword,
    setSelectedFaculty,
    setSelectedDepartment,
    setSelectedQualification,
    setShowRegistrationPopup,
    isLoading,
    authError
  } = useSignupForm();

  return (
    <form onSubmit={handleSubmit}>
      {showError && (
        <div className="bg-red-900/30 border border-red-500 border-dotted text-red-200 px-4 py-2 mb-4 rounded-lg">
          {authError.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder=""
          required
        />
        <Input
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder=""
          required
        />
      </div>

      <Input
        label="Student Number"
        type="number"
        value={studentNumber}
        name="studentNumber"
        onChange={handleInputChange}
        placeholder=""
        icon={User}
        required
      />

      {validationErrors.username && (
        <div className="flex items-start pb-2">
          <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
          <p className="text-red-400 text-xs">{validationErrors.username}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        icon={Mail}
        readOnly
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        name="password"
        onChange={handleInputChange}
        placeholder=""
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        required
      />

      {validationErrors.password && (
        <div className="flex items-start pb-2">
          <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
          <p className="text-red-400 text-xs">{validationErrors.password}</p>
        </div>
      )}

      <Select
        label="Faculty"
        value={selectedFaculty}
        onChange={(value) => {
          setSelectedFaculty(value);
          setSelectedDepartment('');
          setSelectedQualification('');
        }}
        options={facultyOptions}
        icon={Building}
        required
      />

      <Select
        label="Department"
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        options={departmentOptions}
        icon={Building}
        disabled={!selectedFaculty}
        required
      />

      <Select
        label="Qualification"
        value={selectedQualification}
        onChange={setSelectedQualification}
        options={qualificationOptions}
        icon={GraduationCap}
        disabled={!selectedDepartment}
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        icon={UserPlus}
        disabled={!isAgreement || validationErrors.username !== '' || validationErrors.password !== '' || !isFormValid}
      >
        Create Account
      </Button>

      <div className="flex items-center space-x-2 my-2">
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreement}
          onChange={handleAgreementChange}
          className="text-blue-400 focus:ring-0 ring-0"
        />
        <label htmlFor="agreement" className="text-sm text-gray-400">
          I agree to the <a href="#" className="text-blue-400 hover:underline">terms of use</a> and <a href="#" className="text-blue-400 hover:underline">policies</a>
        </label>
      </div>

      <div className="text-center my-2">
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Already have an account? Login
        </button>
      </div>

      <AuthModal
        title="Confirm Your Email"
        message={`A verification email is being sent to ${email}. Please double check and confirm that it's correct.`}
        isOpen={showRegistrationPopup}
        onClose={() => setShowRegistrationPopup(false)}
        onConfirm={handleRegistrationConfirm}
        confirmButtonText="Confirm & Register"
      />
    </form>
  );
};