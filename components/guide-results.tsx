"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GuideResponse } from "@/app/actions"
import { MapPin, Briefcase, Home, Heart, Globe, Utensils, HelpCircle, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FallbackImage } from "./fallback-image"
import { HousingRecommendations } from "@/components/housing/housing-recommendations"

interface GuideResultsProps {
  data: GuideResponse
  location: string
}

export function GuideResults({ data, location }: GuideResultsProps) {
  return (
    <Card className="mt-8 shadow-lg border-sky-100 dark:border-sky-900 border-2 dark:bg-gray-900 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-center text-sky-700 dark:text-sky-400 transition-colors duration-300">
          Your Personalized Guide to {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4 dark:bg-gray-800 transition-colors duration-300">
            <TabsTrigger
              value="welcome"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              Welcome
            </TabsTrigger>
            <TabsTrigger
              value="housing"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <Home className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Housing</span>
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <Briefcase className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <Heart className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="food"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <Utensils className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <Globe className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-colors duration-300"
            >
              <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="welcome"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Welcome to {location}</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.welcomeMessage}</p>
          </TabsContent>

          <TabsContent
            value="housing"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Housing Recommendations</h3>
            <p className="whitespace-pre-line dark:text-gray-300 mb-6">{data.housingInfo}</p>

            <HousingRecommendations
              location={location}
              budget={data.budget || 2000}
              housingType={data.housingType || "Apartment"}
            />
          </TabsContent>

          <TabsContent
            value="jobs"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Job Opportunities</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.jobSuggestions}</p>

            {data.jobListings && data.jobListings.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700 dark:text-sky-400">Featured Job Listings</h4>
                <div className="grid gap-4">
                  {data.jobListings.map((job, index) => (
                    <div
                      key={index}
                      className="p-4 bg-sky-50 dark:bg-sky-900/30 rounded-md border border-sky-100 dark:border-sky-900 transition-colors duration-300"
                    >
                      <div className="font-medium text-lg dark:text-white">{job.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {job.company} • {job.location} • {job.salary}
                      </div>
                      <p className="text-sm mb-3 dark:text-gray-300">{job.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors duration-300"
                        onClick={() => window.open(job.link, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Job
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="events"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Events & Places</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.eventsOrHobbySpots}</p>

            {data.events && data.events.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700 dark:text-sky-400">Upcoming Events</h4>
                <div className="grid gap-4">
                  {data.events.map((event, index) => (
                    <div
                      key={index}
                      className="p-4 bg-sky-50 dark:bg-sky-900/30 rounded-md border border-sky-100 dark:border-sky-900 transition-colors duration-300"
                    >
                      <div className="font-medium text-lg dark:text-white">{event.name}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                        </span>
                        <span className="inline-flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-sm mb-3 dark:text-gray-300">{event.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors duration-300"
                        onClick={() => window.open(event.link, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Event Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="food"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Food Recommendations</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.foodRecommendations}</p>

            {data.restaurants && data.restaurants.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700 dark:text-sky-400">Top Restaurant Picks</h4>
                <div className="grid gap-4">
                  {data.restaurants.map((restaurant, index) => (
                    <div
                      key={index}
                      className="p-4 bg-sky-50 dark:bg-sky-900/30 rounded-md border border-sky-100 dark:border-sky-900 transition-colors duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/4">
                          <FallbackImage
                            src={restaurant.photoUrl || "/placeholder.svg?height=200&width=300&query=restaurant"}
                            alt={restaurant.name}
                            fallbackSrc="/cozy-italian-corner.png"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-lg dark:text-white">{restaurant.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {restaurant.type} • {restaurant.priceRange || "$-$$"} • {restaurant.rating} ★
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{restaurant.address}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors duration-300"
                            onClick={() => window.open(restaurant.link, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Map
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="language"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Language Resources</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.languageLearningHelp}</p>
          </TabsContent>

          <TabsContent
            value="support"
            className="p-4 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Support Services</h3>
            <p className="whitespace-pre-line dark:text-gray-300">{data.supportServices}</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
