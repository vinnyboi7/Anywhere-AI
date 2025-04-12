"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GuideResponse } from "@/app/actions"
import { MapPin, Briefcase, Home, Heart, Globe, Utensils, HelpCircle, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FallbackImage } from "./fallback-image"

interface GuideResultsProps {
  data: GuideResponse
  location: string
}

export function GuideResults({ data, location }: GuideResultsProps) {
  return (
    <Card className="mt-8 shadow-lg border-sky-100 border-2">
      <CardHeader>
        <CardTitle className="text-xl text-center text-sky-700">Your Personalized Guide to {location}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="housing">
              <Home className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Housing</span>
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="events">
              <Heart className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="food">
              <Utensils className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="support">
              <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Welcome to {location}</h3>
            <p className="whitespace-pre-line">{data.welcomeMessage}</p>
          </TabsContent>

          <TabsContent value="housing" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Housing Recommendations</h3>
            <p className="whitespace-pre-line">{data.housingInfo}</p>
          </TabsContent>

          <TabsContent value="jobs" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
            <p className="whitespace-pre-line">{data.jobSuggestions}</p>

            {data.jobListings && data.jobListings.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700">Featured Job Listings</h4>
                <div className="grid gap-4">
                  {data.jobListings.map((job, index) => (
                    <div key={index} className="p-4 bg-sky-50 rounded-md border border-sky-100">
                      <div className="font-medium text-lg">{job.title}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {job.company} • {job.location} • {job.salary}
                      </div>
                      <p className="text-sm mb-3">{job.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sky-700 border-sky-200 hover:bg-sky-100"
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

          <TabsContent value="events" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Events & Places</h3>
            <p className="whitespace-pre-line">{data.eventsOrHobbySpots}</p>

            {data.events && data.events.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700">Upcoming Events</h4>
                <div className="grid gap-4">
                  {data.events.map((event, index) => (
                    <div key={index} className="p-4 bg-sky-50 rounded-md border border-sky-100">
                      <div className="font-medium text-lg">{event.name}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                        </span>
                        <span className="inline-flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{event.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sky-700 border-sky-200 hover:bg-sky-100"
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

          <TabsContent value="food" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Food Recommendations</h3>
            <p className="whitespace-pre-line">{data.foodRecommendations}</p>

            {data.restaurants && data.restaurants.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sky-700">Top Restaurant Picks</h4>
                <div className="grid gap-4">
                  {data.restaurants.map((restaurant, index) => (
                    <div key={index} className="p-4 bg-sky-50 rounded-md border border-sky-100">
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
                          <div className="font-medium text-lg">{restaurant.name}</div>
                          <div className="text-sm text-gray-600 mb-1">
                            {restaurant.type} • {restaurant.priceRange || "$-$$"} • {restaurant.rating} ★
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{restaurant.address}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sky-700 border-sky-200 hover:bg-sky-100"
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

          <TabsContent value="language" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Language Resources</h3>
            <p className="whitespace-pre-line">{data.languageLearningHelp}</p>
          </TabsContent>

          <TabsContent value="support" className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Support Services</h3>
            <p className="whitespace-pre-line">{data.supportServices}</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
