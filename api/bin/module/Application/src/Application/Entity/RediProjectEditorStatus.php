<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectEditorStatus
 *
 * @ORM\Table(name="redi_project_editor_status")
 * @ORM\Entity
 */
class RediProjectEditorStatus
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="status_name", type="string", length=100, nullable=true)
     */
    private $statusName;



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set statusName
     *
     * @param string $statusName
     * @return RediProjectEditorStatus
     */
    public function setStatusName($statusName)
    {
        $this->statusName = $statusName;

        return $this;
    }

    /**
     * Get statusName
     *
     * @return string 
     */
    public function getStatusName()
    {
        return $this->statusName;
    }
}
