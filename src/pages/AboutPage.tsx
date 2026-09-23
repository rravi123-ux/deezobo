import PageHeading from '../components/common/PageHeading';
import FounderStory from '../components/about/FounderStory';
import BrandValues from '../components/about/BrandValues';

export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="About Dee Zobo"
        description="A personal journey that became a made-to-order beverage brand."
      />
      <div className="component-grid">
        <FounderStory />
        <BrandValues />
      </div>
    </>
  );
}
