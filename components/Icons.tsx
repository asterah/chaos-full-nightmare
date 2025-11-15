import React from 'react';

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
    />
  </svg>
);


export const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const ThemeIcon: React.FC<{ theme: 'light' | 'dark'; className?: string }> = ({ theme, className }) => (
  <>
    {/* Sun Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${theme === 'dark' ? 'block' : 'hidden'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
    {/* Moon Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${theme === 'light' ? 'block' : 'hidden'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  </>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.861 3.835 4.26 1.183c.737.204 1.033 1.144.493 1.65l-3.35 3.033 1.05 4.544c.17 1.25-.56 1.77-1.284 1.22l-3.865-2.26-3.865 2.26c-.724.55-1.454.03-1.283-1.22l1.05-4.544-3.35-3.033c-.54-.506-.244-1.446.493-1.65l4.26-1.183 1.86-3.835Z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 2c.276 0 .5.224.5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 10 2ZM8.12 3.88a.5.5 0 0 1 .71-.002l.706.707a.5.5 0 0 1-.707.707l-.707-.706a.5.5 0 0 1-.002-.707ZM5 9.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1A.5.5 0 0 1 5 9.5Zm1.88-4.92a.5.5 0 0 1 .002.707l-.707.707a.5.5 0 0 1-.707-.707l.706-.707a.5.5 0 0 1 .707-.002ZM15 9.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm-1.88-4.92a.5.5 0 0 1 .707.002l.707.706a.5.5 0 1 1-.707.707l-.707-.707a.5.5 0 0 1 .002-.707ZM10 15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5ZM8.12 15.12a.5.5 0 0 1 .71.002l.706-.707a.5.5 0 0 1 .707.707l-.707.706a.5.5 0 0 1-.707-.002ZM11.88 15.12a.5.5 0 0 1 .002-.707l.707-.706a.5.5 0 0 1 .707.707l-.706.707a.5.5 0 0 1-.707.002Z" clipRule="evenodd" />
    <path d="M10 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM8 9.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
  </svg>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.312 11.225c.395.395.395 1.035 0 1.43l-3.364 3.363a1 1 0 0 1-1.43-.017l-.017-1.43 1.54-1.54a.5.5 0 0 0-.353-.854H7a3 3 0 0 1-3-3V7.5a.5.5 0 0 1 1 0V9a2 2 0 0 0 2 2h4.188l-1.54-1.54a.5.5 0 0 1 .854-.353l1.43.017a1 1 0 0 1 .017 1.43l-3.363 3.364ZM4.688 8.775c-.395-.395-.395-1.035 0-1.43l3.364-3.363a1 1 0 0 1 1.43.017l.017 1.43-1.54 1.54a.5.5 0 0 0 .353.854H13a3 3 0 0 1 3 3v1.5a.5.5 0 0 1-1 0V11a2 2 0 0 0-2-2H8.812l1.54 1.54a.5.5 0 0 1-.854.353l-1.43-.017a1 1 0 0 1-.017-1.43l3.363-3.364Z" clipRule="evenodd" />
  </svg>
);

export const Square2StackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h6A1.5 1.5 0 0 1 16 3.5v6A1.5 1.5 0 0 1 14.5 11h-2.5a.5.5 0 0 1 0-1h2.5a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5v2.5a.5.5 0 0 1-1 0v-2.5Z" />
    <path d="M3.5 7A1.5 1.5 0 0 0 2 8.5v6A1.5 1.5 0 0 0 3.5 16h6a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 9.5 7h-6Zm.5 1.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-6Z" />
  </svg>
);

export const MinusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
  </svg>
);

export const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);