//Region Markers
import Lviv from './images/Lviv.png';
import Volyn from './images/Volyn.png';
import Rivne from './images/Rivne.png';
import Chernivtsi from './images/Chernivtsi.png';
import Zakarpattia from './images/Zakarpattia.png';
import Kyiv from './images/Kyiv.png';
import Cherkasy from './images/Cherkasy.png';
import Kharkiv from './images/Kharkiv.png';
import Odessa from './images/Odessa.png';
import Donetsk from './images/Donetsk.png';
import Vinnytsia from './images/Vinnytsia.png';
import Chernihiv from './images/Chernihiv.png';
import Zhytomyr from './images/Zhytomyr.png';
import Kirovohrad from './images/Kirovohrad.png';
import Ternopil from './images/Ternopil.png';
import IvanoFrankivsk from './images/IvanoFrankivsk.png';
import Mykolaiv from './images/Mykolaiv.png';
import Khmelnytskyi from './images/Khmelnytskyi.png';
import Luhansk from './images/Luhansk.png';
import Kherson from './images/Kherson.png';
import Dnipropetrovsk from './images/Dnipropetrovsk.png';
import Zaporizhia from './images/Zaporizhia.png';
import Poltava from './images/Poltava.png';
import Sumy from './images/Sumy.png';

import React, { Component, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import jwt_decode from 'jwt-decode';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import userMarkerImage from './images/user-marker.png';
import complaintMarkerImage from './images/complaint-marker.png';
import militaryComplaintMarkerImage from './images/military-complaint-marker.png';
import resolvedComplaintMarkerImage from './images/resolved-complaint-marker.png';
import './Map.css';

import { options } from './map-options';

import {
    validateToken,
    getRegionId,
    createComplaint,
    getMarkersForRegion,
    processImages,
    getMarker,
    getMarkerImages,
    getUser,
    changeRating,
    updateMarkerStatus,
    getRegions,
    getUnresolvedMarkersCountByUserId,
} from '../components/user-functions';

const RegionImages = {
    Lviv,
    Volyn,
    Rivne,
    Chernivtsi,
    Zakarpattia,
    Kyiv,
    Cherkasy,
    Kharkiv,
    Odessa,
    Donetsk,
    Vinnytsia,
    Chernihiv,
    Zhytomyr,
    Kirovohrad,
    Ternopil,
    IvanoFrankivsk,
    Mykolaiv,
    Khmelnytskyi,
    Luhansk,
    Kherson,
    Dnipropetrovsk,
    Zaporizhia,
    Poltava,
    Sumy,
};

const mapStyle = {
    height: '100%',
    width: '100%',
    margin: '0',
    padding: '0',
    position: 'relative',
};

const getGeolocation = async () => {
    const latLng = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position, error) => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });

            if (error) reject(error);
        });
    });
    return latLng;
};

const getGeocode = async (latLng) => {
    const geocoder = new window.google.maps.Geocoder();

    const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latLng }, async (result, error) => {
            resolve(result);
            if (error) reject(error);
        });
    });
    return result;
};

const MapComponent = () => {
    const [createIsClicked, showComponent] = useState(false);
    const [markerIsClicked, showMarkerInfo] = useState(false);
    const [complaintName, setComplaintName] = useState('');
    const [complaintDescription, setComplaintDescription] = useState('');
    const [complaintLatitude, setComplaintLatitude] = useState('');
    const [complaintLongitude, setComplaintLongitude] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [regionMarkers, setRegionMarkers] = useState([]);
    const [geolocation, setGeolocation] = useState(undefined);
    const [geocode, setGeocode] = useState(undefined);

    const [markerId, setMarkerId] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [userType, setUserType] = useState('');
    const [isApprovedAuthority, setIsApprovedAuthority] = useState(false);

    const [slides, setSlides] = useState([]);

    const [currentMarkerName, setCurrentMarkerName] = useState('');
    const [currentMarkerDescription, setCurrentMarkerDescription] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [dateCreated, setDateCreated] = useState(0);
    const [rating, setRating] = useState(0);

    const [markerInProcess, setInProcess] = useState(true);
    const [isMilitary, setIsMilitary] = useState(false);

    const [complaintIsMilitary, setComplaintType] = useState(false);

    const [showPopUp, setShowPopUp] = useState(false);

    const history = useHistory();

    const handleClose = () => showComponent(false);
    const handleShow = () => showComponent(true);

    const handleShowPopUp = () => setShowPopUp(true);
    const handleClosePopUp = () => setShowPopUp(false);

    const handleCloseMarker = () => showMarkerInfo(false);
    const handleShowMarker = () => showMarkerInfo(true);

    const handleComplaintTypeSwitch = () => {
        setComplaintType(!complaintIsMilitary);
    };

    useEffect(() => {
        async function fetchData() {
            const geolocation = { lat: 49.55589, lng: 25.60556 }; // await getGeolocation();
            const geocode = await getGeocode(geolocation);

            let regionName;
            for (let i = 0; i < geocode.length; i++) {
                if (geocode[i].types[0] === 'administrative_area_level_1') {
                    regionName = geocode[i].address_components[0].long_name;
                }
            }

            const regionId = (await getRegionId(regionName)).data._id;

            const markers = (await getMarkersForRegion(regionId)).data.markers;

            const regionMarkersDb = (await getRegions()).regions;

            for (let j = 0; j < regionMarkersDb.length; j++) {
                if (regionMarkersDb[j].name === regionName) {
                    regionMarkersDb.splice(j, 1);
                    break;
                }
            }

            return [markers, geolocation, geocode, regionMarkersDb];
        }
        fetchData().then((res) => {
            setMarkers((oldArray) => [...oldArray, ...res[0]]);
            setGeolocation(res[1]);

            setGeocode(res[2]);

            setRegionMarkers(res[3]);
        });
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.token;

        const creatorId = jwt_decode(token).id;

        const { count } = await getUnresolvedMarkersCountByUserId(creatorId);

        if (count >= parseInt(process.env.REACT_APP_MAX_COMPLAINTS_PER_PERSON)) {
            handleClose();
            handleShowPopUp();
            return;
        }

        let regionName;
        for (let i = 0; i < geocode.length; i++) {
            if (geocode[i].types[0] === 'administrative_area_level_1') {
                regionName = geocode[i].address_components[0].long_name;
            }
        }

        const regionId = (await getRegionId(regionName)).data._id;

        const longitude = complaintLongitude || geolocation.lng;
        const latitude = complaintLatitude || geolocation.lat;

        const complaint = {
            name: complaintName,
            description: complaintDescription,
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            creator: creatorId,
            inProcess: true,
            isMilitary: complaintIsMilitary,
            region: regionId,
            createdAt: new Date().getTime(),
        };

        const response = (await createComplaint(complaint)).data;

        const { createdMarker } = response;

        await processImages(selectedImages, createdMarker._id, creatorId);

        if (createdMarker) {
            updateMarkersHandler(createdMarker);

            history.push({
                pathname: '/map',
            });
        }

        handleClose();
    };

    const filesSelectedHandler = (e) => {
        setSelectedImages((oldArray) => [...oldArray, ...e.target.files]);
    };

    const updateMarkersHandler = (newMarker) => {
        setMarkers((oldArray) => [...oldArray, newMarker]);
    };

    const handleMarkerClick = async (markerId) => {
        const token = localStorage.token;

        const { marker } = (await getMarker(markerId)).data;

        const { markerImages } = (await getMarkerImages(markerId)).data;

        const { user } = (await getUser(marker.creator)).data;

        const currentUser = (await getUser(jwt_decode(token).id)).data.user;

        setCurrentUserId(currentUser._id);

        setInProcess(marker.inProcess);

        setIsMilitary(marker.isMilitary);

        setUserType(currentUser.userType);

        setIsApprovedAuthority(currentUser.isApprovedAuthority);

        setMarkerId(marker._id);

        setAuthorName(`${user.firstName} ${user.lastName}`);

        setDateCreated(marker.createdAt);

        setRating(marker.rating);

        setCurrentMarkerName(marker.name);

        setCurrentMarkerDescription(marker.description);

        setSlides(
            markerImages
                ? markerImages.map((img) => ({
                      src: window.location.origin + img.image,
                  }))
                : [],
        );

        handleShowMarker();
    };

    const handleRegionMarkerClick = async (markerId) => {
        const markersForRegion = (await getMarkersForRegion(markerId)).data.markers;

        setMarkers((oldMarkers) => [...oldMarkers, ...markersForRegion]);

        for (let j = 0; j < regionMarkers.length; j++) {
            if (regionMarkers[j]._id === markerId) {
                regionMarkers.splice(j, 1);
                break;
            }
        }
        setRegionMarkers([...regionMarkers]);
    };

    const handleRatingChange = async (isPositive) => {
        const like = {
            isPositive,
            markerId: markerId,
            userId: currentUserId,
        };
        const { newRating } = (await changeRating(like)).data;

        setRating(newRating);
    };

    const handleResolveComplaint = async () => {
        const inProcess = false;
        await updateMarkerStatus(markerId, inProcess);

        setInProcess(inProcess);

        handleCloseMarker();
    };

    const regularComplaintForm = (
        <form onSubmit={onSubmit} onError={() => setShowPopUp(true)}>
            <h5 className='h5 mb-3 font-weight-normal'>Describe the problem</h5>
            <div className='form-group row'>
                <label className='col-md-4 col-form-label text-md-right' htmlFor='complaintName'>
                    Name
                </label>
                <div className='col-md-6'>
                    <input
                        type='complaintName'
                        className='form-control'
                        name='complaintName'
                        required
                        value={complaintName}
                        onChange={(e) => setComplaintName(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label
                    className='col-md-4 col-form-label text-md-right'
                    htmlFor='complaintDescription'
                >
                    Description
                </label>
                <div className='col-md-6'>
                    <textarea
                        className='form-control'
                        id='message-text'
                        value={complaintDescription}
                        required
                        onChange={(e) => setComplaintDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-md-4 col-form-label text-md-right' htmlFor='images'>
                    Images
                </label>
                <div className='col-md-6'>
                    <input
                        type='file'
                        alt='yourImages'
                        className='form-control'
                        name='image'
                        multiple
                        accept='.jpg, .jpeg, .png'
                        onChange={filesSelectedHandler}
                    />
                </div>
            </div>
        </form>
    );

    const militaryComplaintForm = (
        <form onSubmit={onSubmit} onError={() => setShowPopUp(true)}>
            <h5 className='h5 mb-3 font-weight-normal'>Describe the problem</h5>
            <div className='form-group row'>
                <label className='col-md-4 col-form-label text-md-right' htmlFor='complaintName'>
                    Name
                </label>
                <div className='col-md-6'>
                    <input
                        type='complaintName'
                        className='form-control'
                        name='complaintName'
                        required
                        value={complaintName}
                        onChange={(e) => setComplaintName(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label
                    className='col-md-4 col-form-label text-md-right'
                    htmlFor='complaintDescription'
                >
                    Description
                </label>
                <div className='col-md-6'>
                    <textarea
                        className='form-control'
                        id='message-text'
                        required
                        value={complaintDescription}
                        onChange={(e) => setComplaintDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label
                    className='col-md-4 col-form-label text-md-right'
                    htmlFor='militaryComplaintLatitude'
                >
                    Latitude
                </label>
                <div className='col-md-6'>
                    <input
                        type='complaintLatitude'
                        className='form-control'
                        name='complaintLatitude'
                        required
                        value={complaintLatitude}
                        onChange={(e) => setComplaintLatitude(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label
                    className='col-md-4 col-form-label text-md-right'
                    htmlFor='militaryComplaintLongitude'
                >
                    Longitude
                </label>
                <div className='col-md-6'>
                    <input
                        type='complaintLongitude'
                        className='form-control'
                        name='complaintLongitude'
                        required
                        value={complaintLongitude}
                        onChange={(e) => setComplaintLongitude(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-md-4 col-form-label text-md-right' htmlFor='images'>
                    Images
                </label>
                <div className='col-md-6'>
                    <input
                        type='file'
                        alt='yourImages'
                        className='form-control'
                        name='image'
                        multiple
                        accept='.jpg, .jpeg, .png'
                        onChange={filesSelectedHandler}
                    />
                </div>
            </div>
            <div>
                <a
                    style={{ color: 'red' }}
                    href='https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop'
                >
                    Need help with finding coordinates?
                </a>
            </div>
        </form>
    );

    const PopUp = (
        <Modal
            show={handleShowPopUp}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>You can't create more complaints</h4>
                <p>
                    Dear user, You already have {process.env.REACT_APP_MAX_COMPLAINTS_PER_PERSON}{' '}
                    unresolved complaints submitted
                </p>
                <p>You need to wait some time while your previous complaints are being resolved</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClosePopUp}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    const ModalWindow = (
        <>
            <Modal dialogClassName='modal-window' show={createIsClicked} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: 'bold' }}>
                        Submit complaint
                        <div>
                            <h5 style={{ marginTop: '10%', textDecoration: 'underline' }}>
                                Military complaint mode
                            </h5>
                            <BootstrapSwitchButton
                                checked={complaintIsMilitary}
                                onlabel='On'
                                offlabel='Off'
                                onChange={handleComplaintTypeSwitch}
                            />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!complaintIsMilitary ? regularComplaintForm : militaryComplaintForm}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='outline-primary' onClick={onSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    const ModalWindowMarker = (
        <>
            <Modal dialogClassName='modal-window' show={markerIsClicked} onHide={handleCloseMarker}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#000000', fontWeight: 'bold' }}>
                        {currentMarkerName}
                        <div style={{ marginTop: '5%', textDecoration: 'green underline' }}>
                            {!markerInProcess ? (
                                <h2 style={{ color: 'green' }}>Issue is resolved!</h2>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div style={{ marginTop: '5%', textDecoration: 'red underline' }}>
                            {isMilitary ? (
                                <h2 style={{ color: 'red' }}>Issue is military!</h2>
                            ) : (
                                <></>
                            )}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel images={slides} />
                    <div style={{ marginTop: '5%' }}>
                        <h5
                            id='markerDescription'
                            style={{
                                paddingLeft: '5%',
                                paddingRight: '5%',
                                wordWrap: 'break-word',
                                textAlign: 'justify',
                            }}
                        >
                            {currentMarkerDescription}
                        </h5>
                    </div>
                    <div style={{ left: '10px', paddingTop: '3%', paddingLeft: '5%' }}>
                        <h5>Rating: {rating}</h5>
                        <ThumbUpIcon
                            id='thumbUp'
                            style={{ color: '#32CD32', marginRight: '10px' }}
                            onClick={() => handleRatingChange(true)}
                        />
                        <ThumbDownIcon
                            id='thumbDown'
                            style={{ color: '#FF0000', marginLeft: '10px' }}
                            onClick={() => handleRatingChange(false)}
                        />
                    </div>
                    {userType >= 2 && isApprovedAuthority && markerInProcess ? (
                        <div style={{ marginTop: '5%' }}>
                            <h5>
                                <Button
                                    variant='outline-success'
                                    onClick={handleResolveComplaint}
                                    style={{ color: '#32CD32' }}
                                >
                                    Resolve the issue:
                                </Button>
                            </h5>
                        </div>
                    ) : (
                        <></>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ position: 'absolute', left: '10px' }}>
                        <h6>Author: {authorName}</h6>
                        {new Date(dateCreated).toDateString()}
                    </div>
                    <Button variant='danger' onClick={handleCloseMarker}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    return (
        <GoogleMap
            mapContainerStyle={mapStyle}
            options={options}
            onLoad={async (map) => {
                const controlUI = document.createElement('div');
                controlUI.onclick = handleShow;
                controlUI.className = 'create-marker-ui';
                controlUI.style.backgroundColor = '#fff';
                controlUI.style.border = '2px solid #fff';
                controlUI.style.borderRadius = '3px';
                controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                controlUI.style.cursor = 'pointer';
                controlUI.style.marginBottom = '22px';
                controlUI.style.marginTop = '35px';
                controlUI.style.marginLeft = '7px';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Click to create a marker';

                const controlText = document.createElement('div');
                controlText.style.color = 'rgb(25,25,25)';
                controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                controlText.style.fontSize = '20px';
                controlText.style.lineHeight = '43px';
                controlText.style.paddingLeft = '5px';
                controlText.style.paddingRight = '5px';
                controlText.style.fontWeight = '30px';
                controlText.innerHTML = 'Create Complaint';
                controlUI.appendChild(controlText);

                map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(controlUI);

                const geolocation = { lat: 49.55589, lng: 25.60556 }; // await getGeolocation();
                const geocode = await getGeocode(geolocation);

                setGeolocation(geolocation);

                setGeocode(geocode);

                map.panTo(geolocation);
            }}
        >
            {createIsClicked ? ModalWindow : null}
            {markerIsClicked ? ModalWindowMarker : null}
            {showPopUp ? PopUp : null}
            {markers.map((mapMarker) => {
                return (
                    <Marker
                        key={mapMarker._id}
                        onLoad={(marker) => {
                            marker.setPosition({
                                lat: mapMarker.latitude,
                                lng: mapMarker.longitude,
                            });
                            marker.setAnimation(window.google.maps.Animation.BOUNCE);
                        }}
                        icon={
                            mapMarker.isMilitary
                                ? militaryComplaintMarkerImage
                                : mapMarker.inProcess
                                ? complaintMarkerImage
                                : resolvedComplaintMarkerImage
                        }
                        onClick={() => handleMarkerClick(mapMarker._id)}
                    ></Marker>
                );
            })}
            {regionMarkers.map((mapMarker) => {
                return (
                    <Marker
                        key={mapMarker._id}
                        onLoad={(marker) => {
                            marker.setPosition({
                                lat: mapMarker.latitude,
                                lng: mapMarker.longitude,
                            });
                            marker.setAnimation(window.google.maps.Animation.BOUNCE);
                        }}
                        icon={RegionImages[mapMarker.name.split(' ')[0].replace('-', '')]}
                        onClick={() => handleRegionMarkerClick(mapMarker._id)}
                    ></Marker>
                );
            })}
            <Marker
                onLoad={async (marker) => {
                    const latLng = { lat: 49.55589, lng: 25.60556 }; //await getGeolocation();
                    marker.setPosition(latLng);
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                }}
                icon={userMarkerImage}
            />
        </GoogleMap>
    );
};

class Map extends Component {
    constructor() {
        super();
        this.state = {
            access: true,
        };

        this.onChange = this.onChange.bind(this);
    }

    async componentDidMount() {
        try {
            const token = localStorage.token;

            await validateToken(token);
        } catch {
            this.setState({
                access: false,
            });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const forbidden = (
            <div style={{ textAlign: 'center', marginTop: '25%' }}>
                <h1>FORBIDDEN</h1>
            </div>
        );

        return (
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                {this.state.access ? <MapComponent /> : forbidden}
            </LoadScript>
        );
    }
}

export default Map;
