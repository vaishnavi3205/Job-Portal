import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (cat) => {
        dispatch(setSearchedQuery(cat));
        navigate("/browse");
    };

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 p-1 text-center">
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="rounded-full border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/60 text-xs sm:text-sm font-medium transition-all shadow-xs w-full"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel;