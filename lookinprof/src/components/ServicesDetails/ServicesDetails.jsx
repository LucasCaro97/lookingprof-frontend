import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import axios from 'axios';
import InputImage from "../Profile/serviceProfile/InputImage"
import UserInfo from "../Profile/serviceProfile/UserInfo"
import StarRatingSelect from "../Profile/serviceProfile/StarRatingSelect"

const ServicesDetails = () => {
    const { id } = useParams();
    const jwt = localStorage.getItem('jwt');
    const [servicesData, setServicesData] = useState({});
    const [similarServices, setSimilarServices] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = window.innerWidth < 1024 ? 1 : 3; // Show 1 item on mobile, 3 items on desktop
    const [responseUrl, setResponseUrl] = useState(null);
    const [username, setUsername] = useState("");
    const [profession, setProfession] = useState("");
    const [about, setAbout] = useState('');
    const [phone, setPhone] = useState('');
    const [newComment, setNewComment] = useState('hidden');
    const [imgUserSession, setImgUserSession] = useState("");
    const [nameUserSession, setNameUserSession] = useState("");
    const [idUserSession, setIdUserSession] = useState("");
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);
    const [qualify, setQualify] = useState("");

    {/**
    Obtengo info del profesional a mostrar y del usuario logueado a traves del token
    */}
    useEffect(() => {

        {/**
            Obtengo informacion del profesional a mostrar en la interfaz
        */}
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:8080/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setServicesData(response.data);
            setResponseUrl(response.data.imageUrl);
            const username = response.data.firstName + " " + response.data.lastName;
            setUsername(username)
            setProfession(response.data.profession)
            setAbout(response.data.description)
            setPhone(response.data.phone)

            {/* 
                Obtengo informacion del token para mostrar los datos del usuario logueado en la seccion "Comentarios"
            */}
            const jwtPayload = jwt.split('.')[1];
            const decodedPayload = JSON.parse(atob(jwtPayload));
            setImgUserSession(decodedPayload.imageProfile)
            setNameUserSession(decodedPayload.firstName)
            setIdUserSession(decodedPayload.id)


            {/**
            Obtengo los comentarios del usuario
             */}
             const comments = await axios.get(`http://localhost:8080/comment/getByUserDestination/${id}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setCommentList(comments.data);

        };
        fetchData();
    }, [id, jwt]);

    {/**
        Obtengo todos los usuarios --> Luego filtra por rol "profesional" y por profesion .
    */}
    useEffect(() => {
        const fetchSimilarServices = async () => {
            const { data } = await axios.get('http://localhost:8080/user/all');
            const filteredServices = data.filter(item =>
                item.role === 'PROFESSIONAL' &&
                item.profession.nameProfession === servicesData.profession.nameProfession &&
                item.idUser !== servicesData.idUser
            );
            
            setSimilarServices(filteredServices);
        };
        if (servicesData.profession) {
            fetchSimilarServices();
        }
    }, [servicesData, servicesData.idUser]);

    useEffect(() => {
        setSimilarServices(prevServices => prevServices.filter(service => service.idUser !== id));
    }, [id]);

    const handleNext = () => {
        setCurrentPage(prevPage => (prevPage % Math.ceil(similarServices.length / itemsPerPage)) + 1);
    };

    const handlePrev = () => {
        setCurrentPage(prevPage => (prevPage === 1 ? Math.ceil(similarServices.length / itemsPerPage) : prevPage - 1));
    };

    {/**
     Realiza la redireccion a whatsapp para contactarse con el profesional 
    */}
    const handleContactCard = (phone) => {
        const url = 'https://wa.me/549' + phone;
        window.open(url, '_blank');
      };

      {/**
     Habilita / Deshabilita el formulario de comentarios 
    */}
    const handleNewComment = () => {
        if(newComment === 'hidden'){
            setNewComment('flex mb-4')
        }else{
            setNewComment('hidden')
        }
      };

      {/**
        Actualiza el estado del comentario
     */}
      const handleComment = (event) => {
        setComment(event.target.value)
    };

    {/**
    Actualiza el estado de la valoracion en el comentario
    */}
    const handleRatingChange = (newRating) => {
        setQualify(newRating);
    };

    {/**
    Realiza el post a la api con el comentario
     */}
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("description", comment)
            formData.append("qualification", qualify)
            formData.append("userOrigin", idUserSession)
            formData.append("userDestination", id )

          const response = await axios.post(`http://localhost:8080/comment`, formData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
            // Otros campos del formulario que desees enviar
          });
    
          window.location.reload();
        } catch (error) {
          console.error('Error al enviar el comentario:', error);
        }
      };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = similarServices.slice(startIndex, endIndex);

    return (
        <div className=''>
            {servicesData.firstName && (
                    <section className='py-4 px-10 flex flex-col justify-center items-center m-auto lg:flex-row gap-8 w-full lg:w-[1100px]'>
                        <div className='flex flex-col gap-6 m-2 w-full lg:w-[600px]'>
                            <div>
                                <h2 className='text-4xl md:text-5xl text-[#004466] font-extrabold'>Hola, mi nombre es {servicesData.firstName} {servicesData.lastName}</h2>
                            </div>
                            <div>
                                <h5 className='font-semibold text-2xl text-[#004466]'>
                                    Soy {servicesData.profession.nameProfession && servicesData.profession.nameProfession.toString().toLowerCase()}
                                </h5>
                            </div>
                            <div>
                                <h5 className='font-semibold'>Lugar de residencia</h5>
                                <span>{servicesData.city.nameCity}, {servicesData.province.nameProvince}</span>
                            </div>
                            <div>
                                <h5 className='font-semibold'>Acerca de </h5>
                                <div>{ servicesData.description}</div>
                            </div>
                        </div>
                        <div className='border-[1px] p-4 rounded-xl shadow-lg w-full md:w-[400px]'>
                        <div className='flex flex-col items-center justify-center w-full'>
                        <img src={responseUrl ? "http://localhost:8080/user/images/" + responseUrl : "/default-image.jpg"} className='w-[200px] h-[200px] rounded-full p-4' />
                            <InputImage name={username} title={profession} qualification={5} about={about}/>
                            <Button variant='contained' color='primary' onClick={() => handleContactCard(phone)}>
                                Contactar
                            </Button>
                        </div>
                        </div>
                    </section>
            )}
            <section className='py-4 px-10 flex flex-col m-auto w-full lg:w-[1100px]'>
                <div className='flex'>
                <h4 className='font-semibold text-xl text-[#004466] p-4'>Opiniones del Servicio</h4>
                <div className='my-auto'>
                <Button variant='contained' color='primary' className='h-9' onClick={handleNewComment} >
                    Comentar
                </Button>
                </div>
                </div>
                
                <div className={newComment}>
                    <div className='w-1/6 flex flex-col justify-center items-center border border-gray-300 rounded-l-2xl'>
                        <img src={imgUserSession ? "http://localhost:8080/user/images/" + imgUserSession : "/default-image.jpg"} className='w-[60px] h-[60px] md:w-[100px] md:h-[100px]  rounded-full p-4' />
                        <p className='w-[100px]mx-auto'>{nameUserSession}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className=" flex flex-col pl-4 py-2 w-full border border-gray-300 bg-slate-100  rounded-r-2xl">
                    <div className="md:flex md:items-center mb-6">
                        <div>
                            <StarRatingSelect onChange={handleRatingChange}/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex w-full ">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="comentario">
                            Comentario
                        </label>
                        </div>
                        <div className="flex w-full pr-6 ">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-400" id="comentario" type="text" onChange={handleComment}/>
                        </div>
                    </div>
                    
                    <div className="md:flex md:items-center">
                        <Button variant='contained' color='primary' className='' type='submit' >
                            Enviar
                        </Button>
                    </div>
                </form>
                </div>
                
                
                <div className='flex flex-col gap-4'>
                {commentList.length === 0 ? (
                    
                    <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                    <p className="font-bold">No hay comentarios disponibles</p>
                    <p className="text-sm">Aún no se han realizado comentarios.</p>
                  </div>
                ) :  (
                    commentList.map(comment => (
                        <div key={comment.id} className=' border border-gray-950 rounded-3xl px-4 pt-2 pb-8'>
                            <div className='flex gap-2'>
                            <div>{comment.userOrigin}</div>
                            <div>{comment.createdAt}</div>
                            <div>{comment.date}</div>
                            <div><UserInfo valoration={comment.qualification} /></div>     
                            </div>
                            <div>{comment.description}</div>
                        </div>
                ))
                )
            
                }
                
                
                </div>
            </section>
            <div className='xl:block flex flex-col items-center justify-center mt-4'>
            <h1 className='flex justify-center font-semibold text-2xl text-[#004466]'>Otros profesionales en la zona</h1>
                <section className=' flex flex-col justify-center m-auto gap-1 lg:flex-row  lg:w-[1100px]'>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <div key={item.idUser} className='lg:p-4 lg:m-4 border-[#004466] w-[300px] shadow-slate-400 shadow-xl border-2 rounded-lg h-auto'>
                                <div className='flex flex-col justify-center items-center'>
                                <img src={item.imageUrl ? "http://localhost:8080/user/images/" + item.imageUrl : "default-image.jpg"} className=' rounded-full w-1/2 mb-4 cover' />
                                    <div>
                                        <h4 className='font-semibold text-xl'>{item.firstName} {item.lastName}</h4>
                                        <div className='text-sm'>{item.profession.nameProfession}</div>
                                        <div>{item.city.nameCity}, {item.province.nameProvince}</div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center py-2'>
                                    <Button variant='contained' color='primary' onClick={() => navigate(`/services/${item.idUser}`)}>
                                        Contactar
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        "No hay profesionales similares para mostrar"
                    )}
                    </section>
                    <div className='flex flex-row items-center justify-center mt-4 gap-5'>
                        <button className=' text-2xl text-[#004466]' onClick={handlePrev}>
                            <FaChevronCircleLeft />
                        </button>
                        <button className='  text-2xl text-[#004466]' onClick={handleNext}>
                            <FaChevronCircleRight />
                        </button>
                    </div>
                
                
            </div>
            <div className='p-10'>
                <Button color='primary' variant='contained' size='large' onClick={() => navigate('/services')}>
                    Volver a Servicios
                </Button>
            </div>
        </div>
    )
}

export default ServicesDetails;
