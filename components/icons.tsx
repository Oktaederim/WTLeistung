
import React from 'react';

export const PowerIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const WaterFlowIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export const HumidityIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.265a8.25 8.25 0 01-5.836-2.433m5.836 2.433a8.25 8.25 0 005.836-2.433M12 18.265V15.25A3.25 3.25 0 008.75 12h-.015M12 15.25A3.25 3.25 0 0115.25 12h.015m-3.265 3.25V5.735a8.25 8.25 0 015.836 2.433M12 5.735a8.25 8.25 0 00-5.836 2.433m11.672 0a8.25 8.25 0 00-11.672 0" />
  </svg>
);

export const TemperatureIcon = ({ className }: { className?: string }): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V10.5h-4.5M19.5 3.507L4.5 18.507m15 0V13.5h-4.5m4.5 5.007L4.5 8.507" />
    </svg>
);

export const InfoIcon = ({ className }: { className?: string }): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const EfficiencyIcon = ({ className }: { className?: string }): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 7a2 2 0 11-4 0 2 2 0 014 0zM17 17L7 7" />
    </svg>
);

export const PipeDiameterIcon = ({ className }: { className?: string }): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.92969 4.92969L19.0718 19.0718" />
    </svg>
);
