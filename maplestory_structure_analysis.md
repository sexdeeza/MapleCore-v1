# MapleStory Assets Structure Analysis

**Generated:** 2025-07-17 18:26:20
**Location:** `C:\Users\khuwa\Desktop\maplekaede\public\assets\maplestory`

## Overview

This folder contains **55,805 files** organized in **16,103 folders** with a total size of **26.0 MB**.

## Organization Pattern

The assets are organized into 14 main categories:

### 1. Hair/ (20,823 files)
Contains various game assets.

Structure example:
```
Hair/
  ├── 00030000.img/ (4 files)
  ├── 00030001.img/ (4 files)
  ├── 00030002.img/ (4 files)
  ├── 00030003.img/ (4 files)
  ├── 00030004.img/ (4 files)
  └── ... (4488 more folders)
```

### 2. Weapon/ (10,402 files)
Contains various game assets.

Structure example:
```
Weapon/
  ├── 01212000.img/ (5 files)
  ├── 01212001.img/ (5 files)
  ├── 01212002.img/ (5 files)
  ├── 01212003.img/ (5 files)
  ├── 01212004.img/ (5 files)
  └── ... (4021 more folders)
```

### 3. Longcoat/ (5,454 files)
Contains various game assets.

Structure example:
```
Longcoat/
  ├── 01050000.img/ (6 files)
  ├── 01050001.img/ (6 files)
  ├── 01050002.img/ (6 files)
  ├── 01050003.img/ (6 files)
  ├── 01050004.img/ (6 files)
  └── ... (1013 more folders)
```

### 4. Cap/ (4,405 files)
Contains various game assets.

Structure example:
```
Cap/
  ├── 01000000.img/ (4 files)
  ├── 01000001.img/ (4 files)
  ├── 01000002.img/ (4 files)
  ├── 01000003.img/ (3 files)
  ├── 01000004.img/ (3 files)
  └── ... (1616 more folders)
```

### 5. Coat/ (3,468 files)
Contains various game assets.

Structure example:
```
Coat/
  ├── 01040000.img/ (6 files)
  ├── 01040001.img/ (6 files)
  ├── 01040002.img/ (6 files)
  ├── 01040003.img/ (6 files)
  ├── 01040004.img/ (6 files)
  └── ... (613 more folders)
```

### 6. Glove/ (2,310 files)
Contains various game assets.

Structure example:
```
Glove/
  ├── 01080000.img/ (5 files)
  ├── 01080001.img/ (5 files)
  ├── 01081000.img/ (5 files)
  ├── 01081001.img/ (5 files)
  ├── 01081002.img/ (5 files)
  └── ... (452 more folders)
```

### 7. Face/ (2,210 files)
Contains various game assets.

Structure example:
```
Face/
  ├── 00020000.img/ (2 files)
  ├── 00020001.img/ (2 files)
  ├── 00020002.img/ (2 files)
  ├── 00020003.img/ (2 files)
  ├── 00020004.img/ (2 files)
  └── ... (1100 more folders)
```

### 8. Shoes/ (2,006 files)
Contains various game assets.

Structure example:
```
Shoes/
  ├── 01070000.img/ (3 files)
  ├── 01070001.img/ (3 files)
  ├── 01070002.img/ (3 files)
  ├── 01070003.img/ (3 files)
  ├── 01070004.img/ (3 files)
  └── ... (789 more folders)
```

### 9. Accessory/ (1,809 files)
Contains various game assets.

Structure example:
```
Accessory/
  ├── 01010000.img/ (3 files)
  ├── 01010001.img/ (3 files)
  ├── 01010002.img/ (3 files)
  ├── 01010003.img/ (3 files)
  ├── 01010004.img/ (3 files)
  └── ... (854 more folders)
```

### 10. Pants/ (1,484 files)
Contains various game assets.

Structure example:
```
Pants/
  ├── 01060000.img/ (3 files)
  ├── 01060001.img/ (3 files)
  ├── 01060002.img/ (3 files)
  ├── 01060003.img/ (3 files)
  ├── 01060004.img/ (3 files)
  └── ... (521 more folders)
```


*Plus 4 additional categories*

## File Type Distribution

- **Image files**: 39,928 files (71.5%)
- **Audio files**: 0 files (0.0%)
- **Data files**: 15,872 files (28.4%)
- **Other files**: 5 files

### Most common file types:
- `.png`: 39,928 files (71.5%)
- `.xml`: 15,872 files (28.4%)
- `.db`: 5 files (0.0%)

## Structure Explanation

Based on the analysis, this appears to be a typical game asset structure with:

1. **Asset Separation**: Different types of assets (images, audio, data) are organized in separate folders
2. **Hierarchical Organization**: Assets are further categorized by their purpose (characters, items, maps, etc.)
3. **Naming Convention**: Files and folders follow a consistent naming pattern for easy identification

### Typical Asset Path Examples:
```
maplestory/
  ├── images/
  │   ├── characters/
  │   │   ├── player/
  │   │   └── npc/
  │   └── items/
  │       ├── equipment/
  │       └── consumables/
  ├── audio/
  │   ├── bgm/
  │   └── sfx/
  └── data/
      ├── maps/
      └── skills/
```

This organization allows for:
- Easy asset management and updates
- Efficient loading by category
- Clear separation of concerns
- Scalable structure for adding new content
