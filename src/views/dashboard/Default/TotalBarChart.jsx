import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalBarChart from 'ui-component/cards/Skeleton/TotalBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-bar-chart';

export default function TotalBarChart({ isLoading }) {
  const [value, setValue] = React.useState('today');
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
  const errorMain = theme.palette.error.main;
  const successDark = theme.palette.success.dark;

  React.useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [errorMain, successDark],
      xaxis: {
        labels: {
          style: {
            style: { colors: primary }
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            style: { colors: primary }
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: mode },
      legend: { labels: { colors: grey500 } }
    };

    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [mode, errorMain, successDark, primary, darkLight, divider, isLoading, grey500]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid>
                  <Grid container direction="column" spacing={1}>
                    <Grid>
                      <Typography variant="subtitle2">Total Kegiatan</Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="h3">50</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid>
                 
                </Grid>
              </Grid>
            </Grid>
            <Grid
              size={12}
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: `brightness(0.95)`,
                    transition: 'all 0.3s ease'
                  }
                }),
                '& .apexcharts-menu': {
                  bgcolor: 'background.paper'
                },
                '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                  bgcolor: 'dark.main'
                },
                '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-theme-light .apexcharts-reset-icon:hover svg, .apexcharts-theme-light .apexcharts-selection-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoom-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoomin-icon:hover svg, .apexcharts-theme-light .apexcharts-zoomout-icon:hover svg':
                  {
                    fill: theme.palette.grey[400]
                  }
              }}
            >
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

TotalBarChart.propTypes = { isLoading: PropTypes.bool };
