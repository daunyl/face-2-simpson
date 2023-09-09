/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

import { FORM_CONSTANTS, FORM_DATA_KEYS } from '../_constants';
import { generateFetchURL, isValidFileType } from '../_helpers';
import {
  FeedbackData,
  PredictInitialValues,
  PredictSimpsonData,
  SimpsonCharacter,
} from '../_types';
import Loader from './loading';
import FileInput from '@app/_components/inputs/FileInput';
import SubmitButton from '@app/_components/buttons/SubmitButton';
import CheckboxInput from '@app/_components/inputs/Checkbox';
import Modal from '@app/_components/misc/Modal';

const sendFeedback = async function (
  url: string,
  data: FeedbackData,
  formData: FormData
): Promise<void> {
  try {
    formData.append(FORM_DATA_KEYS.PREDICTION_RESULT, JSON.stringify(data));

    await axios.post(url, formData);
  } catch (e) {
    if (e instanceof Error) console.error(e);
  }
};

const predictSimpson = async function (
  url: string,
  formData: FormData
): Promise<PredictSimpsonData | undefined> {
  try {
    const { data } = await axios.post(url, formData);

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e);
  }
};

const initialValues: PredictInitialValues = {
  personImg: null,
};

const validationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  personImg: Yup.mixed<File>()
    .required('An image is required')
    .test('fileType', 'Unsupported File Format', (value) => {
      return isValidFileType(
        value.name && value.name.toLowerCase(),
        'personImg'
      );
    })
    .test(
      'fileSize',
      'File Size is too large',
      (value: any) =>
        value && value.size <= Number(FORM_CONSTANTS.MAX_PERSON_IMG_SIZE)
    ),
});

export default function Home() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>();
  const [imgFormData, setImgFormData] = useState<FormData>();
  const [permissionToStore, setPermissionToStore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictSimpsonData>();

  const receiveFeedback = function (
    data: PredictSimpsonData | undefined
  ): void {
    if (!data) return;
    setPredictionData(data);
    setShowModal(true);
  };

  const submitFeedbackToServer = async function (): Promise<void> {
    if (!feedbackData || !imgFormData) return;
    await sendFeedback(
      generateFetchURL('DELETE_PERSON_IMG', {}, {}),
      feedbackData,
      imgFormData
    );
  };

  const handleApprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: true,
      permissionToStore,
    });
    setShowModal(false);
  };

  const handleDisapprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: false,
      permissionToStore,
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: null,
      permissionToStore,
    });
    setShowModal(false);
  };

  const handleSubmit = async function ({ personImg }: any) {
    console.log('Submitting...');
    const formData = new FormData();
    formData.append(FORM_DATA_KEYS.PREDICTION_IMG, personImg);

    const data = await predictSimpson(
      generateFetchURL('PREDICT_PERSON_IMG', {}, {}),
      formData
    );
    setImgFormData(formData);
    receiveFeedback(data);
  };

  useEffect(() => {
    submitFeedbackToServer();
  }, [feedbackData]);

  return (
    <>
      <Modal
        show={showModal}
        data={predictionData?.predictionData}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onDisapprove={handleDisapprove}
      />
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <>
              {isSubmitting && <Loader />}
              <Form className='w-full max-w-sm space-y-6'>
                <FileInput
                  name={'personImg'}
                  accept={FORM_CONSTANTS.ACCEPT_PERSON_IMG_EXTENSIONS}
                  setFieldValue={setFieldValue}
                />
                <CheckboxInput
                  label='Can we store your data?'
                  checked={permissionToStore}
                  onChange={setPermissionToStore}
                />
                <SubmitButton />
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}
