import { Landmark, Trees, Flame, Compass, Palette, Waves, PawPrint, Mountain, Building2, MapPin } from 'lucide-react'

// Maps a category slug to a representative icon. Falls back to a generic
// pin for any category added later that isn't in this list yet.
const CATEGORY_ICONS = {
  heritage: Landmark,
  nature: Trees,
  religious: Flame,
  adventure: Compass,
  cultural: Palette,
  beach: Waves,
  wildlife: PawPrint,
  'hill-station': Mountain,
  historical: Building2,
}

export const getCategoryIcon = (slug) => CATEGORY_ICONS[slug] || MapPin
