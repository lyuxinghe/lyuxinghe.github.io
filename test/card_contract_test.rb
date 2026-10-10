require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require 'yaml'
require 'open3'

class CardContractTest < Minitest::Test
  CHECKER = File.expand_path('../scripts/check_cards.rb', __dir__)

  def setup
    assert File.file?(CHECKER), 'The shared card contract must have a build-time validator'
    @root = Dir.mktmpdir('card-contract-')
    FileUtils.mkdir_p(File.join(@root, '_data'))
    FileUtils.mkdir_p(File.join(@root, 'img'))
    File.write(File.join(@root, 'img/cover.jpg'), '')
    File.write(File.join(@root, 'card-deck.css'), '.card-deck .archive-card-title { font-size: 18px; }')
    @entry = {
      'id' => 'example', 'sort_date' => 202610,
      'card' => { 'year' => '2026', 'title' => 'Example', 'subtitle' => 'A label', 'image' => 'img/cover.jpg' },
      'detail' => { 'description' => 'Section-specific detail content' }
    }
    write_data('publications', [@entry])
    write_data('projects', [@entry])
    write_data('experience', { 'lanes' => [{ 'id' => 'education', 'organizations' => [@entry] }] })
  end

  def teardown
    FileUtils.remove_entry(@root) if @root
  end

  def write_data(name, value)
    File.write(File.join(@root, '_data', "#{name}.yml"), YAML.dump(value))
  end

  def check
    output, errors, status = Open3.capture3('ruby', CHECKER, @root)
    [status.success?, output + errors]
  end

  def test_identical_record_is_valid_in_every_section
    success, output = check
    assert success, output
  end

  def test_optional_supporting_text_is_shared_by_every_section
    @entry['card']['supporting_text'] = 'M.S. in Artificial Intelligence'
    write_data('publications', [@entry])
    write_data('projects', [@entry])
    write_data('experience', { 'lanes' => [{ 'id' => 'education', 'organizations' => [@entry] }] })
    success, output = check
    assert success, output
  end

  def test_supporting_text_must_be_nonblank_text
    ['', ['Not a text value']].each do |value|
      @entry['card']['supporting_text'] = value
      write_data('experience', { 'lanes' => [{ 'id' => 'work', 'organizations' => [@entry] }] })
      success, output = check
      refute success
      assert_includes output, 'card.supporting_text'
    end
  end

  def test_image_crop_is_available_in_every_section
    @entry['card']['image_crop'] = { 'zoom' => 2.08, 'x' => 50, 'y' => 75 }
    write_data('publications', [@entry])
    write_data('projects', [@entry])
    write_data('experience', { 'lanes' => [{ 'id' => 'education', 'organizations' => [@entry] }] })
    success, output = check
    assert success, output
  end

  def test_image_crop_rejects_invalid_zoom_and_origins
    [{ 'zoom' => 0.5 }, { 'zoom' => 5 }, { 'x' => -1 }, { 'y' => 101 }, { 'zoom' => 'large' }].each do |invalid|
      @entry['card']['image_crop'] = { 'zoom' => 2, 'x' => 50, 'y' => 75 }.merge(invalid)
      write_data('publications', [@entry])
      success, output = check
      refute success
      assert_includes output, 'card.image_crop'
    end
  end

  def test_missing_card_title_is_rejected
    @entry['card'].delete('title')
    write_data('publications', [@entry])
    success, output = check
    refute success
    assert_includes output, 'card.title'
  end

  def test_per_card_font_setting_is_rejected
    @entry['card']['font_size'] = 32
    write_data('projects', [@entry])
    success, output = check
    refute success
    assert_includes output, 'font_size'
  end

  def test_experience_legacy_fields_cannot_bypass_the_shared_schema
    @entry['card_date'] = '2026'
    write_data('experience', { 'lanes' => [{ 'id' => 'work', 'organizations' => [@entry] }] })
    success, output = check
    refute success
    assert_includes output, 'card_date'
  end

  def test_section_specific_card_styling_is_rejected
    File.write(File.join(@root, 'card-deck.css'), '.card-deck--projects .archive-card-title { font-size: 24px; }')
    success, output = check
    refute success
    assert_includes output, 'shared card style'
  end

  def test_logo_specific_card_styling_is_rejected
    File.write(File.join(@root, 'card-deck.css'), '.archive-card--logo .archive-card-subtitle { font-size: 17px; }')
    success, output = check
    refute success
    assert_includes output, 'shared card style'
  end

  def test_missing_cover_image_is_rejected
    @entry['card']['image'] = 'img/missing.jpg'
    write_data('publications', [@entry])
    success, output = check
    refute success
    assert_includes output, 'img/missing.jpg'
  end

  def test_duplicate_ids_in_a_deck_are_rejected
    write_data('projects', [@entry, @entry])
    success, output = check
    refute success
    assert_includes output, 'duplicate id'
  end
end
