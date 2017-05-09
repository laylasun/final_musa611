# MUSA 611 Final Project

## Map Viz for Step-2 K-Means and Step-3 Score Map for Capstone Project
### Link
- [Map for MUSA 611](https://laylasun.github.io/final_musa611/)
- [Step-1 K-Means results](https://laylasun.shinyapps.io/musa620_shinyFinal/) if interested
- [Detailed description of the Step-1 map](https://github.com/laylasun/musa620_shinyFinal/blob/master/app/about.md)
- For detailed explanation of the results, please read the [write-up](https://github.com/laylasun/musa620_shinyFinal/blob/master/addiontalFiles/musa800_writeup1.pdf) for the Capstone project.

### Best browser dimensions to view the map
Best view with the following browser dimensions: (check your [browser's dimensions](http://whatsmy.browsersize.com/))

- Browser window width:	1280
- Browser window height:	551
- Screen width:	1280
- Screen height:	720
- Screen color depth:	24

### Features

Section #1 should look like this (with the above-mentioned browser dimensions):

![section1](https://github.com/laylasun/final_musa611/blob/master/img/img001.png)

- Clustering results given different values for K can be viewed **separately** for the two cities.
- Toggle the **layer control** on the top-right to switch between two basemaps.
- When the **Amazon Go** is _checked_ on the layer control panel, a marker will be placed at the location of the current prototype Amazon Go in Seattle.
- __Click__ the Amazon Go marker will **zoom in** the map to the location of store, as well as show the popup.
- To reset the center of the map, click the first button under the zoom-in and zoom-out buttons. To return to the default setting of layer on the map, click the button below the Re-Center button.
- The intersected blocks can only be viewed together for both cities. The maps will zoom into the centers of the active layers.

![section2](https://github.com/laylasun/final_musa611/blob/master/img/img002.png)

Section #2 should look like this (with the above-mentioned browser dimensions):

![section3](https://github.com/laylasun/final_musa611/blob/master/img/img003.png)

- Select a topic to map
- Legend for both map will be displayed under the selection menus.
- Button on the left is to re-center both maps; button on the right is to reset the selection to the beginning.

![section4](https://github.com/laylasun/final_musa611/blob/master/img/img004.png)

Section #3 should look like this (with the above-mentioned browser dimensions):
**_This section will be loaded EXTREMELY SLOWLY_** due to the size of the dataset used and the filtering function... find something to distract when viewing this section....

![section5](https://github.com/laylasun/final_musa611/blob/master/img/img005.png)

- Enter two values to see the cells with the scores matching the inputs.
  1. __within__: will display the cells with the values that fall in the interval of the two input values as shown below.
  ![section6](https://github.com/laylasun/final_musa611/blob/master/img/img006.png)
  2. __above the min.__: will display the cells with the scores that are greater than the min. value of the two inputs as shown below.
  ![section7](https://github.com/laylasun/final_musa611/blob/master/img/img009.png)
  3. __above the cutoff__: will display the cells with the scores that are greater than the max. value of the two inputs as shown below.
  ![section8](https://github.com/laylasun/final_musa611/blob/master/img/img007.png)
  4. Click the **Reset for Input** will only reset the map. It is quite annoying to enter new inputs; so if the entered inputs are preferred, they will be left there for reuse.

- Draw rectangles on the map to view the cells, whose centroids fall within the boundary of the drawn shape. This function WILL NEED EVEN LONGER TIME TO PROCESS...
- The resulting layer will stay on the map for comparison. Use the __Erase Patches__ button to clean up all the shapes and layers on the map.   
![section9](https://github.com/laylasun/final_musa611/blob/master/img/img008.png)
