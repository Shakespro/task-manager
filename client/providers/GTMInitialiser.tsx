"use client"

import React, { useEffect } from 'react'
import TagManager from 'react-gtm-module'

function GTMInitialiser() {
    useEffect(() => {
        const tagManagerArgs = {
          gtmId: 'GTM-5DNQDMJ4',
        };

        TagManager.initialize(tagManagerArgs)
        }, []);
        return null;
    }

export default GTMInitialiser