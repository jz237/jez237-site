import React from 'react';
import { createRoot } from 'react-dom/client';
import EngineLab from './app/engine-lab';
import './app/globals.css';
import './standalone.css';
createRoot(document.getElementById('root')!).render(<EngineLab/>);
