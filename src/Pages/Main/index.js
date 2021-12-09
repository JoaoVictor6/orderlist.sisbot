import React, {useContext, useState} from 'react';
import {useToasts} from 'react-toast-notifications';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faDownload,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JSZip from 'jszip';
import axios from 'axios';

import saveAs from '../../../node_modules/jszip/vendor/FileSaver';
import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';
import ModalTextInput from '../../components/ModalTextInput';
import Utils from '../../Utils';
import ModalSendViaEmail from '../../components/ModalSendViaEmail';
import {CustomInputAsHeaderText} from '../BussinessPricing/styles';
import ControlPanel from '../../components/ControlPanel';

// const HCAPTCHA_SERVER_CHECK = 'http://localhost/hcaptcha/';
const HCAPTCHA_SERVER_CHECK = 'https://list.oneformes.com/hcaptcha/';

const Main = () => {
  const {
    Translator,
    showDashboard,
    setShowDashboard,
    orderListItems,
    listName,
    setListName,
    companyEmail,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const [HCaptchaToken, setHCaptchaToken] = useState('');
  const [requestLoading, setRequestLoading] = useState(null);
  const [zipFileName, setZIPFileName] = useState('');
  const [showModalConfirmDownload, setShowModalConfirmDownload] = useState(
    false,
  );

  const [clientName, setClientName] = useState('');
  const [targetEmail, setTargetEmail] = useState(companyEmail);
  const [showModalSendMail, setShowModalSendMail] = useState(false);

  const handleCLoseModalTextInput = () => {
    setZIPFileName('');
    setShowModalConfirmDownload(false);
  };

  const handleCloseModalSendMail = () => {
    setRequestLoading(null);
    setShowModalSendMail(false);
    setClientName('');
    setTargetEmail('');
    setHCaptchaToken('');
  };

  const generateZip = async () => {
    const zip = new JSZip();

    const sisbotGender = {
      MALE: 'ma',
      FEMALE: 'fe',
      CHILDISH: 'c',
    };

    const sisbotClothingID = {
      TSHIRT: 'CSVID_TSHIRT',
      TSHIRTLONG: 'CSVID_TSHIRTLONG',
      SHORTS: 'CSVID_SHORTS',
      PANTS: 'CSVID_PANTS',
      TANKTOP: 'CSVID_TANKTOP',
      VEST: 'CSVID_VEST',
    };

    const csvFullData = [];

    orderListItems.map((orderItem) => {
      const firstClothe = orderItem.clothingSettings.filter(
        (item) => item.gender !== '',
      )[0];

      const csvDataToJoin = [];
      const sisbotGenderTranslated = sisbotGender[firstClothe.gender];
      csvDataToJoin.push(sisbotGenderTranslated);
      csvDataToJoin.push(orderItem.name);
      csvDataToJoin.push(orderItem.number);

      orderItem.clothingSettings.map((theClothe) => {
        // ADJUST SIZE FOR CHILDISH (IT CAME WITH WORK ANOS|YEARS|ANÕS)
        const theSize =
          firstClothe.gender === 'CHILDISH'
            ? Translator(theClothe.size).replace(/ anos| years old| años/i, '')
            : Translator(theClothe.size);

        csvDataToJoin.push(
          `${Translator(sisbotClothingID[theClothe.name.toUpperCase()])}=${
            theClothe.quantity > 0 ? `${theClothe.quantity}-${theSize}` : ''
          }`,
        );
        return theClothe;
      });

      const csvRow = csvDataToJoin.join(',');
      csvFullData.push(csvRow);
      return orderItem;
    });

    const csvHeader = [];
    csvHeader.push(Translator('CSVID_GENDER'));
    csvHeader.push(Translator('CSVID_NAME'));
    csvHeader.push(Translator('CSVID_NUMBER'));
    csvHeader.push(Translator('CSVID_TSHIRT'));
    csvHeader.push(Translator('CSVID_TSHIRTLONG'));
    csvHeader.push(Translator('CSVID_SHORTS'));
    csvHeader.push(Translator('CSVID_PANTS'));
    csvHeader.push(Translator('CSVID_TANKTOP'));
    csvHeader.push(Translator('CSVID_VEST'));

    // ADD CSV HEADER
    csvFullData.unshift(csvHeader.join(','));

    // ADD FILES TO ZIP
    zip.file(`${Translator('MAIN_TITLE')}.csv`, csvFullData.join('\n'));
    zip.file('list.bkp', btoa(localStorage.getItem('sisbot')));
    zip.file(
      `${Translator('INSTRUCTIONS_FILENAME')}.txt`,
      `${Translator('INSTRUCTIONS_CONTENT')}`,
    );

    // DOWNLOAD ZIP
    const blobContent = await zip.generateAsync({type: 'blob'});
    return blobContent;
  };

  const handleDownload = async (confirmed = false) => {
    if (!confirmed) {
      setShowModalConfirmDownload(true);
      return;
    }

    const safeFilename =
      zipFileName === '' ? Translator('MAIN_TITLE') : zipFileName;
    const zipData = await generateZip();
    saveAs(zipData, `${safeFilename}.zip`);

    setShowModalConfirmDownload(false);
    setZIPFileName('');

    addToast(Translator('TOAST_DOWNLOAD_COMPLETE'), {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  const handleSendMail = async () => {
    // VALIDATE EMAIL
    if (!Utils.IsValidEmail(targetEmail)) {
      addToast(Translator('TOAST_INVALID_EMAIL'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    // VALIDATE CLIENT NAME
    if (clientName.trim() === '') {
      addToast(Translator('TOAST_EMPTY_CLIENT_NAME'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    // VALIDATE HCAPTCHA
    if (HCaptchaToken === '') {
      addToast(Translator('TOAST_MUST_SOLVE_CAPTCHA'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    setRequestLoading(true);
    const zipData = await generateZip();

    const postData = {
      token: HCaptchaToken,
      zipfile: zipData,
      email: targetEmail,
      client: clientName,
      translatedText: JSON.stringify({
        emailTitle: Translator('MAIN_TITLE'),
        emailBody: Translator('EMAIL_BODY'),
        labelClient: Translator('CLIENT'),
      }),
    };

    const postFormData = new FormData();
    Object.keys(postData).map((key) => postFormData.append(key, postData[key]));

    const serverResponse = await axios
      .post(HCAPTCHA_SERVER_CHECK, postFormData, {
        headers: {'Content-Type': 'multipart/form-data'},
        timeout: 15000,
      })
      .catch((error) => {
        addToast(Translator('TOAST_AXIOS_ERROR'), {
          autoDismiss: true,
          appearance: 'error',
        });

        setRequestLoading(null);

        console.log('AXIOS_ERROR: ', error);
      });

    if (serverResponse === undefined) return;

    if (serverResponse.data === true) {
      setRequestLoading(false);
      setTargetEmail('');
    } else {
      addToast(Translator('TOAST_FAILED_TO_SENT_LIST'), {
        autoDismiss: true,
        appearance: 'error',
      });
      setRequestLoading(null);
    }
  };

  return (
    <>
      <FormAddOrderItem />

      {/* CONTROL PANEL CAN SHOW/HIDE */}
      {/* @NEW_CODE_POSITION */}
      <ControlPanel>
        <Row>
          <Col xs="12" sm="6">
            {/* INPUT FOR LIST NAME */}
            <CustomInputAsHeaderText
              type="text"
              value={listName}
              placeholder={Translator('MAIN_TITLE')}
              onChange={({target}) => setListName(target.value)}
            />
          </Col>

          {/* DASHBOARD BUTTONS */}
          <Col className="text-right mb-4">
            <Button
              variant="success"
              className="mr-2"
              size="sm"
              onClick={() => handleDownload()}>
              <FontAwesomeIcon icon={faDownload} />
              <span className="ml-1 d-none d-md-inline-block">
                {Translator('DOWNLOAD')}
              </span>
            </Button>

            <Button
              variant="primary"
              className="mr-2"
              size="sm"
              onClick={() => setShowModalSendMail(true)}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="ml-1 d-none d-md-inline-block">
                {Translator('SEND_MAIL')}
              </span>
            </Button>

            <Button
              className="mr-2"
              variant="secondary"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}>
              <FontAwesomeIcon
                icon={showDashboard ? faEyeSlash : faEye}
                width={35}
              />
              <span className="ml-1 d-none d-md-inline-block">
                {showDashboard
                  ? Translator('DASHBOARD_BUTTON_HIDE')
                  : Translator('DASHBOARD_BUTTON_SHOW')}
              </span>
            </Button>

            <ButtonToggleClothignIcons />
          </Col>
        </Row>

        {/* DASHBOARD BLOCKS WITH VALUES */}
        {showDashboard && <DashboardReports />}

        {/* BUTTONS TO CONTROL TABLE WITH ORDERS */}
        <TableOrdersMenu />
      </ControlPanel>

      {/* DOWNLOAD */}
      <ModalTextInput
        isOpen={showModalConfirmDownload}
        title={Translator('DOWNLOAD_TITLE')}
        inputTextContent={zipFileName}
        labelContent={Translator('ASK_FILENAME')}
        placeholderContent={Translator('MAIN_TITLE')}
        handleChange={(e) => setZIPFileName(e.target.value)}
        handleConfirm={() => handleDownload(true)}
        handleClose={handleCLoseModalTextInput}
      />

      {/* SEND VIA EMAIL */}
      <ModalSendViaEmail
        name={clientName}
        email={targetEmail}
        handleChangeName={({target}) => setClientName(target.value)}
        handleChangeEmail={({target}) => setTargetEmail(target.value.trim())}
        isOpen={showModalSendMail}
        handleConfirm={handleSendMail}
        handleClose={handleCloseModalSendMail}
        requestLoading={requestLoading}
        hcaptchaSolved={(responseToken) => setHCaptchaToken(responseToken)}
      />

      {/*
           CODE WAS MOVED TO NEW UI CONCEPT
           IN CASE IT'S NOT ACCEPTED
           BRING IT BACK HERE
           NEW POSITION IS AT @NEW_CODE_POSITION
           SEARCH FOR IT
      */}

      {/* MAIN TABLE SHOWN ORDERS */}
      <TableOrderList />

      {/* NEW POSITION FOR MAIN BUTTONS */}
      <Row className="mt-2">
        <Col className="text-center">
          <Button
            variant="success"
            className="mr-2"
            size="sm"
            onClick={() => handleDownload()}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DOWNLOAD')}
            </span>
          </Button>

          <Button
            variant="primary"
            className="mr-2"
            size="sm"
            onClick={() => setShowModalSendMail(true)}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('SEND_MAIL')}
            </span>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Main;
