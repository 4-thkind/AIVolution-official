import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmulsionTeamGallery } from '../components/team/EmulsionTeamGallery';

export const TeamPage = () => {
  const [params] = useSearchParams();
  const dept = params.get('dept') || 'all';

  return <EmulsionTeamGallery initialDept={dept} />;
};
