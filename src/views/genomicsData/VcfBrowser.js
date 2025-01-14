import React, { useState, useEffect, useRef } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import { Box, Button, FormControl } from '@mui/material';
import { Grid } from '@material-ui/core';

import { useSelector } from 'react-redux';
import { MultiSelect } from 'react-multi-select-component';
import { BASE_URL, referenceToIgvTrack } from 'store/constant';
import LightCard from 'views/dashboard/Default/LightCard';
import { Map, Description } from '@material-ui/icons';
import DatasetIdSelect from 'views/dashboard/Default/datasetIdSelect';

import VcfInstance from 'ui-component/IGV/VcfInstance';
import { searchVariantSets, getReferenceSet } from 'store/api';

import { notify, NotificationAlert } from 'utils/alert';
import { LoadingIndicator, usePromiseTracker, trackPromise } from 'ui-component/LoadingIndicator/LoadingIndicator';

function VcfBrowser() {
    const [isLoading, setLoading] = useState(true);
    const events = useSelector((state) => state);
    let { datasetId } = events.customization.update.datasetId;
    const notifyEl = useRef(null);
    const [variantSet, setVariantSets] = useState('');
    const [referenceSetName, setReferenceSetName] = useState('');
    const { promiseInProgress } = usePromiseTracker();
    const [options] = useState([]);
    const [selected, setSelected] = useState([]);
    const [variantsTracks, setVariantsTracks] = useState([]);
    const [igvTrackRefGenome, setIgvTrackRefGenome] = useState('');

    /*
  Fetches reference set Name and sets referenceSetName
  * @param {string}... referenceSetId
  */
    function settingReferenceSetName(referenceSetId) {
        getReferenceSet(referenceSetId)
            .then((data) => {
                setReferenceSetName(data.results.name);
            })
            .catch(() => {
                setReferenceSetName('Not Available');
            });
    }

    useEffect(() => {
        setLoading(false);
        setSelected([]);
        setVariantsTracks([]);
        options.length = 0;
        datasetId = events.customization.update.datasetId;

        // Check for variant and reference name set on datasetId changes
        trackPromise(
            searchVariantSets(datasetId)
                .then((data) => {
                    setVariantSets(data.results.total);
                    setSelected([]);
                    options.length = 0;
                    data.results.variantSets.forEach((variant) => {
                        options.push({ label: variant.name, value: variant.id });
                    });
                    setSelected(options);
                    settingReferenceSetName(data.results.variantSets[0].referenceSetId);
                })
                .catch(() => {
                    setVariantSets('Not Available');
                    setReferenceSetName('Not Available');

                    // Do not show error message when datasetId is empty
                    if (datasetId !== '') {
                        notify(notifyEl, 'No VariantSets are available.', 'warning');
                    }
                })
        );
    }, [datasetId, options, events.customization.update.datasetId]);

    const formHandler = (e) => {
        e.preventDefault(); // Prevent form submission
        const tracks = [];

        if (selected) {
            selected.forEach((variantSetId) => {
                const igvVariantObject = {
                    sourceType: 'ga4gh',
                    type: 'variant',
                    url: BASE_URL,
                    referenceName: '',
                    variantSetId: variantSetId.value,
                    name: variantSetId.label,
                    pageSize: 10000,
                    visibilityWindow: 1000000
                };

                tracks.push(igvVariantObject);
            });
        }

        // Determine the reference genome for IGV based on the name of referenceSet
        Object.keys(referenceToIgvTrack).forEach((key) => {
            if (referenceToIgvTrack[key].includes(referenceSetName.toLowerCase())) {
                setIgvTrackRefGenome(key);
            }
        });

        setVariantsTracks(tracks);
    };

    return (
        <>
            <MainCard title="VCF Browser" sx={{ minHeight: 830, position: 'relative' }}>
                <DatasetIdSelect />
                {/* <NotificationAlert ref={notifyEl} /> */}
                <Grid container direction="row" justifyContent="center" spacing={2} p={2}>
                    <Grid item sm={12} xs={12} md={4} lg={4}>
                        {promiseInProgress === true ? (
                            <LoadingIndicator />
                        ) : (
                            <LightCard
                                isLoading={isLoading}
                                header="Reference Genome"
                                value={referenceSetName}
                                icon={<Map fontSize="inherit" />}
                            />
                        )}
                    </Grid>
                    <Grid item sm={12} xs={12} md={4} lg={4}>
                        {promiseInProgress === true ? (
                            <LoadingIndicator />
                        ) : (
                            <LightCard
                                isLoading={isLoading}
                                header="VariantSets/VCFs"
                                value={variantSet}
                                icon={<Description fontSize="inherit" />}
                            />
                        )}
                    </Grid>
                </Grid>
                <form inline onSubmit={formHandler} style={{ justifyContent: 'center' }}>
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} p={2}>
                        <Grid item>
                            {options.length > 0 && (
                                <FormControl>
                                    <Grid container direction="row" alignItems="center">
                                        <Box mr={2}>
                                            <p>VCF</p>
                                        </Box>
                                        <MultiSelect // Width set in CSS
                                            required
                                            options={options}
                                            value={selected}
                                            onChange={setSelected}
                                            labelledBy="Select"
                                        />
                                    </Grid>
                                </FormControl>
                            )}
                        </Grid>

                        <Grid item>
                            <FormControl>
                                <Button type="submit" variant="contained">
                                    Search
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>

                <VcfInstance tracks={variantsTracks} genome={igvTrackRefGenome} />
            </MainCard>
        </>
    );
}

export default VcfBrowser;
