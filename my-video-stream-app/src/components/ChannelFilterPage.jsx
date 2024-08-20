import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Input, Select, Skeleton, Grid, GridItem,Spinner } from '@chakra-ui/react';
import Channel from './Channel';
import { useNavigate } from 'react-router-dom';
  



const countrydata = {
    "Afghanistan": ["PA", "FA", "ISLAM"],
    "Albania": ["ALB"],
    "Algeria": ["ALG", "AFRICA", "AF"],
    "Angola": ["ANGOLA", "AFRICA", "AF"],
    "Argentina": ["ES", "ARG", "LATIN"],
    "Armenia": ["ARM"],
    "Australia": ["AU"],
    "Austria": ["AT", "EURO"],
    "Azerbaijan": ["AZE"],
    "Bangladesh": ["BN", "BANGLA", "BENGALI"],
    "Belgium": ["FR", "NL", "DE", "EURO", "BE"],
    "Benin": ["BENIN", "AFRICA", "AF"],
    "Bosnia": ["BG"],
    "Brazil": ["BR", "PT"],
    "Bulgaria": ["BG", "EURO"],
    "Burkina Faso": ["BURKIN", "BURK", "AFRICA", "AF"],
    "Cambodia": ["CAM"],
    "Cape Verde": ["CAPEVERDE", "AFRICA", "AF"],
    "Chile": ["CL", "LATIN"],
    "China": ["ZH", "CN"],
    "Colombia": ["CO", "LATIN"],
    "Cyprus": ["CY", "EURO"],
    "Czech Republic": ["CZ", "EURO"],
    "Denmark": ["DK", "EURO"],
    "Djibouti": ["DJIBOUTI", "AFRICA", "AF"],
    "Ecuador": ["EC", "LATIN"],
    "Egypt": ["AR", "EGYPT", "ISLAM", "AFRICA"],
    "Estonia": ["EE", "EURO"],
    "Eritrea": ["ERITREA", "AFRICA", "AF"],
    "Ethiopia": ["ETH", "AFRICA", "AF"],
    "Finland": ["FI", "EURO"],
    "France": ["FR", "EURO"],
    "Germany": ["DE", "EURO"],
    "Ghana": ["GH", "AFRICA", "AF"],
    "Greece": ["GR", "EURO"],
    "Guinea": ["GUINEE", "AFRICA", "AF"],
    "Hungary": ["HU", "EURO"],
    "India": ["HI", "EN", "GUJARATI", "KANNADA", "MARATHI", "MALAYALAM", "ODIA", "TAMIL", "TELUGU", "PUNJABI", "INDIA"],
    "Indonesia": ["ID"],
    "Iran": ["IR", "FA", "ISLAM", "IRAN"],
    "Iraq": ["AR", "IRAQ", "ISLAM"],
    "Israel": ["HE", "AR"],
    "Italy": ["IT", "EURO"],
    "Japan": ["JA", "JP"],
    "Jordan": ["AR", "JOR", "ISLAM"],
    "Kenya": ["KE", "AFRICA", "AF"],
    "Korea": ["KR"],
    "Kurdistan": ["KRD"],
    "Kuwait": ["AR", "KU", "KWT", "ISLAM"],
    "Latvia": ["LV", "EURO"],
    "Lebanon": ["AR", "LBN", "ISLAM"],
    "Libya": ["LYB", "AFRICA", "AF"],
    "Lithuania": ["LT", "EURO"],
    "Luxembourg": ["LU", "EURO"],
    "Macedonia": ["MAK"],
    "Mali": ["FR", "MALI", "AFRICA", "AF"],
    "Malta": ["MT", "EURO"],
    "Mexico": ["ES", "MX", "LATIN"],
    "Montenegro": ["MNE"],
    "Morocco": ["MA", "AFRICA", "AF"],
    "Myanmar": ["MY"],
    "Namibia": ["NA", "AFRICA", "AF"],
    "Nepal": ["NU"],
    "Netherlands": ["NL", "EURO"],
    "New Zealand": ["NZ"],
    "Nigeria": ["EN", "HA", "YO", "IG", "AFRICA", "NG", "NIGERIA"],
    "Norway": ["NO", "EURO"],
    "Oman": ["AR", "OMAN", "ISLAM"],
    "Pakistan": ["UR", "PA", "PK", "ISLAM"],
    "Paraguay": ["PY", "LATIN"],
    "Peru": ["PE", "LATIN"],
    "Philippines": ["PH"],
    "Poland": ["PL", "EURO"],
    "Portugal": ["PT", "EURO"],
    "Qatar": ["AR", "QTR", "ISLAM"],
    "Romania": ["RO", "EURO"],
    "Russia": ["RU", "RUS", "EURO"],
    "Rwanda": ["ROWANDA", "AFRICA", "AF"],
    "Saudi Arabia": ["AR", "KSA", "ISLAM"],
    "Senegal": ["SEN", "AFRICA", "AF"],
    "Serbia": ["SRB"],
    "Sierra Leone": ["SIERRALEONE", "AFRICA", "AF"],
    "Slovakia": ["SK", "EURO"],
    "Slovenia": ["SLOV", "EURO"],
    "Somalia": ["SOMALIA", "AFRICA", "AF"],
    "South Africa": ["AF", "EN", "ZU", "AFRICA"],
    "Spain": ["ES", "ESP", "EURO"],
    "Sri Lanka": ["SI", "TA", "LK"],
    "Sudan": ["SUD", "AFRICA", "AF"],
    "Sweden": ["SV", "EURO"],
    "Switzerland": ["FR", "DE", "IT", "EURO"],
    "Syria": ["SYR", "ISLAM"],
    "Taiwan": ["TW", "TWN"],
    "Tanzania": ["TZ", "AFRICA", "AF"],
    "Tunisia": ["TUN", "AFRICA", "AF"],
    "Turkey": ["TR", "ISLAM"],
    "Uganda": ["UG", "AFRICA", "AF"],
    "Ukraine": ["UK", "RUS"],
    "United Arab Emirates": ["AR", "UAE", "ISLAM"],
    "United Kingdom": ["EN", "UK"],
    "United States": ["EN", "US", "CA"],
    "Uruguay": ["UY", "LATIN"],
    "Venezuela": ["VE", "LATIN"],
    "Vietnam": ["VI", "VIA"],
    "Yemen": ["YEMEN", "ISLAM"],
    "Zambia": ["ZM", "AFRICA", "AF"],
    "Zimbabwe": ["ZW", "AFRICA", "AF"]
  };



  const ChannelFilterPage = () => {
    const [channels, setChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchChannels();
    }, []);
  
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8800/api/channels/', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setChannels(response.data);
          setFilteredChannels(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch channels', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSearch = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      filterChannels(term, selectedCountry);
    };
  
    const handleCountryChange = (e) => {
      const country = e.target.value;
      setSelectedCountry(country);
      filterChannels(searchTerm, country);
    };
  
    const filterChannels = (searchTerm, country) => {
      let filtered = channels;
  
      if (searchTerm) {
        filtered = filtered.filter(channel =>
          channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      if (country) {
        const countryRegions = countrydata[country] || [];
        filtered = filtered.filter(channel =>
          channel.ports.some(port => countryRegions.includes(port.region))
        );
      }
  
      setFilteredChannels(filtered);
    };
  
    const onDragEnd = (result) => {
      if (!result.destination) return;
      const items = Array.from(filteredChannels);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setFilteredChannels(items);
    };
  
    const handleChannelClick = (channel, region) => {
      window.open(`/stream/${channel.id}?dataType=live&region=${region}`, '_blank');
    };
    
  
    return (
      <Box p={4}>
        <Box mb={4}>
          <Input
            placeholder="Search channels..."
            value={searchTerm}
            onChange={handleSearch}
            mb={2}
          />
          <Select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">All Countries</option>
            {Object.keys(countrydata).map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </Box>
  
        <Box>
          {loading ? (
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              {Array(12).fill('').map((_, index) => (
                <GridItem key={index}>
                  <Skeleton height="150px" />
                  <Skeleton mt={2} height="20px" />
                  <Skeleton mt={2} height="20px" />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="channels">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
                      {Array.isArray(filteredChannels) && filteredChannels.length > 0 ? (
                        filteredChannels.map((channel, index) => (
                          <GridItem key={channel.id}>
                            <Draggable key={channel.id} draggableId={channel.id} index={index}>
                              {(provided, snapshot) => (
                                <Channel
                                  channel={channel}
                                  onClick={handleChannelClick}
                                  provided={provided}
                                  snapshot={snapshot}
                                />
                              )}
                            </Draggable>
                          </GridItem>
                        ))
                      ) : (
                        <p>No channels available</p>
                      )}
                    </Grid>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Box>
      </Box>
    );
  };
  
  export default ChannelFilterPage;